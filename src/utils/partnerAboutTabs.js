import { ABOUT_PARTNER_STATIC } from '../data/aboutPartnerStatic';

/**
 * Mirrors ordering in `AboutLayout` for `/:locationCode/about` so mega menu and page tabs stay aligned.
 * @param {Array<{ id?: string, heading?: string, title?: string, content?: string }>} partnerAboutSections - from API or empty
 */
export function getOrderedPartnerSections(partnerAboutSections) {
  const fallbackPartnerSections = [
    {
      id: 'about-worso',
      heading: ABOUT_PARTNER_STATIC.title || 'About WORSO',
      content: ABOUT_PARTNER_STATIC.intro,
    },
    ...(ABOUT_PARTNER_STATIC.sections || []).map((section) => ({
      id: section.id,
      heading: section.title,
      content:
        section.content ||
        (Array.isArray(section.points) ? section.points.map((p) => `• ${p}`).join('\n') : ''),
    })),
  ];

  const sourcePartnerSections =
    Array.isArray(partnerAboutSections) && partnerAboutSections.length > 0
      ? partnerAboutSections
      : fallbackPartnerSections;

  const aboutSectionIndex = sourcePartnerSections.findIndex((item, index) => {
    if (index === 0) return true;
    const idText = String(item?.id || '').toLowerCase();
    const headingText = String(item?.heading || item?.title || '').toLowerCase();
    return idText.includes('about') || headingText.includes('about');
  });

  if (aboutSectionIndex >= 0) {
    return [
      sourcePartnerSections[aboutSectionIndex],
      ...sourcePartnerSections.filter((_, index) => index !== aboutSectionIndex),
    ];
  }

  return [
    {
      id: 'about',
      heading: 'About',
      content: ABOUT_PARTNER_STATIC.intro || '',
    },
    ...sourcePartnerSections,
  ];
}

/**
 * Full tab model for `AboutLayout` — same ids as mega menu `?tab=` links.
 */
export function buildPartnerAboutTabsWithContent(partnerAboutSections) {
  const ordered = getOrderedPartnerSections(partnerAboutSections);

  const partnerInfoTabs = ordered.map((item, index) => ({
    id: `partner-about-${item.id ?? index}`,
    type: 'about',
    label: index === 0 ? 'About' : (item.heading || item.title || `About ${index + 1}`),
    heading: index === 0 ? 'About' : (item.heading || item.title || `About ${index + 1}`),
    content: item.content || '',
  }));

  return [
    ...partnerInfoTabs,
    { id: 'partner-advisory-board', type: 'advisory', label: 'Advisory Board' },
    { id: 'partner-referees', type: 'referees', label: 'Referees' },
  ];
}

/** Slim list for mega menu (ids + labels). */
export function buildPartnerAboutTabsList(partnerAboutSections) {
  return buildPartnerAboutTabsWithContent(partnerAboutSections).map(({ id, type, label }) => ({
    id,
    type,
    label,
  }));
}

/** Split menu items into N columns (fills first columns when count not divisible). */
export function splitMenuItemsIntoColumns(items, columnCount = 3) {
  if (!items?.length) return [];
  const n = items.length;
  const base = Math.floor(n / columnCount);
  const remainder = n % columnCount;
  const columns = [];
  let idx = 0;
  for (let c = 0; c < columnCount; c++) {
    const size = base + (c < remainder ? 1 : 0);
    columns.push(items.slice(idx, idx + size));
    idx += size;
  }
  return columns;
}
