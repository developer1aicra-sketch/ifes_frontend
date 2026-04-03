import { getPartnerAbout } from '../api/partnerAboutApi';
import { getAdvisoryBoard, getAdvisoryRefree } from '../api/advisoryApi';

export const DEFAULT_PARTNER_ABOUT_WEBSITE = 'worso';

const normalizePartnerAboutItem = (payload) => {
  if (!payload || typeof payload !== 'object') return null;
  const heading = String(payload.heading || payload.title || '').trim();
  const content = String(payload.content || payload.description || '').trim();
  if (!heading && !content) return null;
  return {
    id: payload._id || payload.id || heading,
    heading: heading || 'About',
    content,
    displayOrder: typeof payload.display_order === 'number' ? payload.display_order : Number.MAX_SAFE_INTEGER,
  };
};

const normalizePartnerPerson = (payload, fallbackDesignation) => {
  if (!payload || typeof payload !== 'object') return null;
  const name = String(payload.name || '').trim();
  const designation = String(payload.designation || payload.role || fallbackDesignation || '').trim();
  const image = payload.image || payload.photo || payload.avatar || '';
  if (!name && !designation && !image) return null;
  return {
    id: payload._id || payload.id || `${name}-${designation}`,
    name: name || 'Member',
    designation: designation || fallbackDesignation,
    image,
    displayOrder: typeof payload.display_order === 'number' ? payload.display_order : Number.MAX_SAFE_INTEGER,
  };
};

const sortByDisplayOrder = (a, b) => a.displayOrder - b.displayOrder;

const unwrapAboutPayload = (res) => {
  const aboutPayload = res?.data?.data ?? res?.data?.about ?? res?.data ?? [];
  const list = Array.isArray(aboutPayload) ? aboutPayload : [aboutPayload];
  return list.filter(Boolean);
};

/** GET /advisory/board/get?website=…&x-partner-code=… */
const unwrapBoardPayload = (res) => {
  const raw =
    res?.data?.data ??
    res?.data?.advisoryBoard ??
    res?.data?.advisory_board ??
    res?.data?.board ??
    res?.data ??
    [];
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') return [raw];
  return [];
};

/** GET /advisory/refree/get?website=…&x-partner-code=… */
const unwrapRefreePayload = (res) => {
  const raw =
    res?.data?.data ??
    res?.data?.advisoryRefree ??
    res?.data?.advisory_refree ??
    res?.data?.refree ??
    res?.data?.refrees ??
    res?.data ??
    [];
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') return [raw];
  return [];
};

/**
 * Loads `/:partnerCode/about` payloads. Requests are independent (Promise.allSettled).
 *
 * - CMS: GET /partner/about/get
 * - Advisory: GET /advisory/board/get?website=worso&x-partner-code=<code>
 * - Referees: GET /advisory/refree/get?website=worso&x-partner-code=<code>
 */
export async function fetchPartnerAboutPageData(website, partnerCode) {
  const [aboutSettled, boardSettled, refreeSettled] = await Promise.allSettled([
    getPartnerAbout(website, partnerCode),
    getAdvisoryBoard(website, partnerCode),
    getAdvisoryRefree(website, partnerCode),
  ]);

  let partnerAboutSections = [];
  let partnerAboutError = '';
  if (aboutSettled.status === 'fulfilled') {
    partnerAboutSections = unwrapAboutPayload(aboutSettled.value)
      .map(normalizePartnerAboutItem)
      .filter(Boolean)
      .sort(sortByDisplayOrder);
  } else {
    console.error('Failed to load partner about sections', aboutSettled.reason);
    partnerAboutError = 'Unable to load partner about sections right now.';
  }

  let partnerAdvisoryBoard = [];
  let partnerAdvisoryBoardError = '';
  if (boardSettled.status === 'fulfilled') {
    partnerAdvisoryBoard = unwrapBoardPayload(boardSettled.value)
      .map((item) => normalizePartnerPerson(item, 'Advisor'))
      .filter(Boolean)
      .sort(sortByDisplayOrder);
  } else {
    console.error('Failed to load advisory board', boardSettled.reason);
    partnerAdvisoryBoardError = 'Unable to load advisory board right now.';
  }

  let partnerReferees = [];
  let partnerRefereesError = '';
  if (refreeSettled.status === 'fulfilled') {
    partnerReferees = unwrapRefreePayload(refreeSettled.value)
      .map((item) => normalizePartnerPerson(item, 'Referee'))
      .filter(Boolean)
      .sort(sortByDisplayOrder);
  } else {
    console.error('Failed to load advisory referees', refreeSettled.reason);
    partnerRefereesError = 'Unable to load referees right now.';
  }

  return {
    partnerAboutSections,
    partnerAboutError,
    partnerAdvisoryBoard,
    partnerAdvisoryBoardError,
    partnerReferees,
    partnerRefereesError,
  };
}
