// API utility functions

import { apiRoutes } from '../constants/apiRoutes';
import { getPartnerCode } from '../api/partnerCode';
import { getAuthToken } from '../api/authToken';
import { getLocationCodeFromPath } from './locationRoutes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://worso-backend-rm6w.vercel.app/api';

const getPartnerCodeForRequest = () => {
  const fromStore = getPartnerCode();
  if (fromStore) return fromStore;
  if (typeof window === 'undefined') return '';
  return getLocationCodeFromPath(window.location?.pathname || '') || '';
};

/**
 * fetch() wrapper for WORSO API calls.
 * Ensures `x-website` + `x-partner-code` are always sent.
 * Injects Authorization: Bearer <token> when a token exists (from authToken) and no Authorization was passed in options.
 */
const apiFetch = (url, options = {}) => {
  const opts = options || {};
  const headers = new Headers(opts.headers || {});

  headers.set('x-website', 'worso');
  headers.set('x-partner-code', getPartnerCodeForRequest());

  if (!headers.has('Authorization') && !headers.has('authorization')) {
    const token = getAuthToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const isFormData = typeof FormData !== 'undefined' && opts.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type') && !headers.has('content-type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, { ...opts, headers });
};

/**
 * Member login with email + password.
 * POST /auth/login on the primary backend.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Response JSON from backend
 */
export const memberLogin = async (email, password) => {
  const response = await apiFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.data?.message ||
      data?.data?.error ||
      `Login failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

/**
 * Fetches partners data from the API
 * @returns {Promise<{success: boolean, partners: Array, pagination: Object}>}
 */
export const fetchPartners = async () => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/partners`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching partners:', error);
    throw error;
  }
};

/**
 * Fetches a single partner by ID or subdomain
 * @param {string} identifier - Partner ID or subdomain
 * @returns {Promise<Object>}
 */
export const fetchPartnerById = async (identifier) => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/partners/${identifier}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching partner:', error);
    throw error;
  }
};

/**
 * Gets the current subdomain from the window location
 * @returns {string|null} The subdomain or null if not found
 */
export const getCurrentSubdomain = () => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // If we have at least 3 parts (subdomain.domain.tld), return the subdomain
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
};

/**
 * Finds a partner by subdomain from the partners array
 * @param {Array} partners - Array of partner objects
 * @param {string} subdomain - Subdomain to match
 * @returns {Object|null} Matching partner or null
 */
export const findPartnerBySubdomain = (partners, subdomain) => {
  if (!partners || !subdomain) return null;

  return partners.find(
    partner => partner.subdomain === subdomain ||
      partner.subdomain?.includes(subdomain) ||
      partner.partnerWebsite?.includes(subdomain)
  ) || null;
};

/**
 * Finds partners by location code
 * @param {Array} partners - Array of partner objects
 * @param {string} locationCode - Location code to match (e.g., "AE", "CL")
 * @returns {Array} Array of matching partners
 */
export const findPartnersByLocation = (partners, locationCode) => {
  if (!partners || !locationCode) return [];

  const code = String(locationCode).toUpperCase().trim();
  return partners.filter((partner) => {
    if (!partner?.isActive) return false;
    // New backend shape: countryCode is the canonical 2-letter identifier (e.g. AE, TH)
    const partnerCountryCode = partner.countryCode ? String(partner.countryCode).toUpperCase().trim() : null;
    if (partnerCountryCode && partnerCountryCode === code) return true;
    // Backward compatibility: some older data used "location" as the 2-letter code
    const partnerLocation = partner.location ? String(partner.location).toUpperCase().trim() : null;
    return Boolean(partnerLocation && partnerLocation === code);
  });
};

/**
 * Gets the primary partner for a location (first active partner)
 * @param {Array} partners - Array of partner objects
 * @param {string} locationCode - Location code to match
 * @returns {Object|null} First active partner for the location or null
 */
export const getPrimaryPartnerByLocation = (partners, locationCode) => {
  const locationPartners = findPartnersByLocation(partners, locationCode);
  return locationPartners.length > 0 ? locationPartners[0] : null;
};

/**
 * Detects partner context from current URL (subdomain, hostname, or query params).
 * Used when partner website is opened - returns location code to redirect to (e.g. "CL", "AE").
 * @returns {Promise<{ locationCode: string | null, partner: object | null }>}
 */
export const detectPartnerFromUrl = async () => {
  if (typeof window === 'undefined') return { locationCode: null, partner: null };

  const url = new URL(window.location.href);
  const hostname = window.location.hostname;
  const subdomain = getCurrentSubdomain();

  let data;
  try {
    data = await fetchPartners();
  } catch (e) {
    return { locationCode: null, partner: null };
  }

  if (!data?.success || !data.partners?.length) return { locationCode: null, partner: null };
  const partners = data.partners;

  // 1. Query param: ?location=CL or ?partner=CL
  const locationParam = url.searchParams.get('location') || url.searchParams.get('partner');
  if (locationParam) {
    const code = String(locationParam).toUpperCase().trim();
    const partner = getPrimaryPartnerByLocation(partners, code);
    if (partner) return { locationCode: code, partner };
  }

  // 2. Subdomain: e.g. keeeailash-tanwar-in-tx26-013.yourdomain.com -> find partner by subdomain
  if (subdomain) {
    const partner = findPartnerBySubdomain(partners, subdomain);
    if (partner?.location) return { locationCode: partner.location, partner };
  }

  // 3. Hostname matches partner website hostname
  try {
    for (const p of partners) {
      if (p.partnerWebsite && hostname) {
        const partnerHost = new URL(p.partnerWebsite).hostname;
        if (partnerHost === hostname || hostname.endsWith('.' + partnerHost)) {
          if (p.location) return { locationCode: p.location, partner: p };
        }
      }
    }
  } catch (_) { }

  return { locationCode: null, partner: null };
};

/**
 * Partner admin login: send OTP to email
 * @param {string} email - Partner admin email
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export const partnerLoginSendOtp = async (email) => {
  const response = await apiFetch(`${API_BASE_URL}/partners/login/send-otp`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

/** Partner auth storage key (token-based session) */
export const PARTNER_AUTH_KEY = 'worso_partner_auth';

/**
 * Get persisted partner auth from storage (token + partner)
 * @returns {{ token: string, partner: object, email: string } | null}
 */
export const getPartnerAuth = () => {
  try {
    const raw = localStorage.getItem(PARTNER_AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.token) return data;
    return null;
  } catch {
    return null;
  }
};

/**
 * Persist partner auth after successful verify-otp
 * @param {{ token: string, partner: object, email: string }} data
 */
export const setPartnerAuth = (data) => {
  try {
    localStorage.setItem(PARTNER_AUTH_KEY, JSON.stringify(data));
  } catch (_) { }
};

/**
 * Clear partner auth (logout)
 */
export const clearPartnerAuth = () => {
  try {
    localStorage.removeItem(PARTNER_AUTH_KEY);
  } catch (_) { }
};

/**
 * Partner admin logout (invalidates token on server)
 * @param {string} token - JWT from login
 * @returns {Promise<void>}
 */
export const partnerLogout = async (token) => {
  const response = await apiFetch(`${API_BASE_URL}/partners/logout`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const msg = data?.message || data?.error || `Logout failed (${response.status})`;
    throw new Error(msg);
  }
};

/**
 * Partner admin login: verify OTP and complete login
 * @param {string} email - Partner admin email (same as send-otp)
 * @param {string} otp - OTP code received by email
 * @returns {Promise<{ success: boolean, message?: string, token?: string, user?: object }>}
 */
export const partnerLoginVerifyOtp = async (email, otp) => {
  const response = await apiFetch(`${API_BASE_URL}/partners/login/verify-otp`, {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Verification failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

/**
 * Update partner profile (authenticated). Editable: academyName, themeColor, contactEmail, phoneNumber.
 * @param {string} partnerId - Partner _id
 * @param {string} token - JWT from partner login
 * @param {object} payload - Full or partial partner details to send as request body
 * @returns {Promise<{ success: boolean, partner?: object }>}
 */
export const updatePartner = async (partnerId, token, payload) => {
  const response = await apiFetch(`${API_BASE_URL}/partners/${partnerId}`, {
    method: 'PUT',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Update failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

// --- Partner Home Content API ---

/**
 * Partner home content API base URL (uses amber backend)
 */
const PARTNER_HOME_API_BASE_URL = 'https://worso-backend-amber.vercel.app/api';

/**
 * Fetch partner home content by country code
 * @param {string} countryCode - Country code (e.g., "IN", "TH")
 * @returns {Promise<{ success: boolean, home?: object, event?: object, socialLinks?: object, footer?: object, quickLinks?: Array, videos?: Array, products?: Array, news?: Array, supporters?: Array, stats?: object }>}
 */
export const fetchPartnerHome = async (countryCode) => {
  try {
    const response = await apiFetch(`${PARTNER_HOME_API_BASE_URL}/partners/home/${countryCode}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching partner home:', error);
    throw error;
  }
};

/**
 * Update partner home content
 * @param {string} partnerId - Partner _id
 * @param {string} token - JWT from partner login (optional, may be required by backend)
 * @param {object} payload - Partner home content to update
 * @returns {Promise<{ success: boolean, ... }>}
 */
export const updatePartnerHome = async (partnerId, token, payload) => {
  const headers = {
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiFetch(`${PARTNER_HOME_API_BASE_URL}/partners/${partnerId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Update failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

// --- Admin dashboard: Season API ---

/**
 * List all seasons
 * @returns {Promise<{ success: boolean, data?: Array }>}
 */
export const listSeasons = async () => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.season.list}`, {
    method: 'GET',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to list seasons (${response.status})`);
  }
  return data;
};

/**
 * List seasons by partner (seasons/get?website=worso&partnerCode=XX).
 * partnerCode should come from the partner route (e.g. /TH/admin-dashboard) or user.partner.partnerCode.
 * @param {string} partnerCode - Partner code (e.g. 'TH')
 * @returns {Promise<{ success?: boolean, data?: Array, seasons?: Array }>}
 */
export const listSeasonsGet = async (partnerCode) => {
  const code = (partnerCode || '').toString().trim();
  if (!code) {
    return { success: true, data: [], seasons: [] };
  }
  const params = new URLSearchParams({ website: 'worso', partnerCode: code });
  const response = await apiFetch(
    `${API_BASE_URL}${apiRoutes.seasonsGetByPartner}?${params.toString()}`,
    { method: 'GET' }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to list seasons (${response.status})`);
  }
  return data;
};

/**
 * Add a season
 * @param {{ name: string, year: number, isActive: boolean }} payload
 * @returns {Promise<{ success: boolean, data?: object }>}
 */
export const addSeason = async (payload) => {
  const body = {
    name: payload.name ?? '',
    year: payload.year ?? new Date().getFullYear(),
    isActive: payload.isActive !== undefined ? payload.isActive : true,
  };
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.season.add}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to add season (${response.status})`);
  }
  return data;
};

/**
 * Get a season by id
 * @param {string} id - Season _id
 * @returns {Promise<{ success: boolean, data?: object }>}
 */
export const getSeason = async (id) => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.season.get(id)}`, {
    method: 'GET',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to get season (${response.status})`);
  }
  return data;
};

/**
 * Update a season
 * @param {string} id - Season _id
 * @param {{ name?: string, year?: number, isActive?: boolean }} payload
 * @returns {Promise<{ success: boolean, data?: object }>}
 */
export const updateSeason = async (id, payload) => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.season.edit(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to update season (${response.status})`);
  }
  return data;
};

/**
 * Delete a season
 * @param {string} id - Season _id
 * @returns {Promise<{ success: boolean }>}
 */
export const deleteSeason = async (id) => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.season.delete(id)}`, {
    method: 'DELETE',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to delete season (${response.status})`);
  }
  return data;
};

// --- Admin dashboard: Event API ---

/**
 * List all events
 * @returns {Promise<{ message?: string, data?: Array }>}
 */
export const listEvents = async () => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.event.list}`, {
    method: 'GET',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to list events (${response.status})`);
  }
  return data;
};

/**
 * List events by website (event/get?website=EG).
 * website from partner route (e.g. /EG/admin-dashboard) or user.partner.partnerCode.
 * @param {string} website - Website code (e.g. 'EG', 'TH')
 * @returns {Promise<{ success?: boolean, data?: Array, events?: Array }>}
 */
export const listEventsGetByWebsite = async (website) => {
  const code = (website || '').toString().trim();
  if (!code) {
    return { success: true, data: [], events: [] };
  }
  const params = new URLSearchParams({ website: code });
  const response = await apiFetch(
    `${API_BASE_URL}${apiRoutes.eventGetByWebsite}?${params.toString()}`,
    { method: 'GET' }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to list events (${response.status})`);
  }
  return data;
};

/**
 * List events by partner (event/get?website=worso&partnerCode=XX).
 * partnerCode from partner route (e.g. /TH/admin-dashboard) or user.partner.partnerCode.
 * @param {string} partnerCode - Partner code (e.g. 'TH')
 * @returns {Promise<{ success?: boolean, data?: Array, events?: Array }>}
 */
export const listEventsGet = async (partnerCode) => {
  const code = (partnerCode || '').toString().trim();
  if (!code) {
    return { success: true, data: [], events: [] };
  }
  const params = new URLSearchParams({ website: 'worso', partnerCode: code });
  const response = await apiFetch(
    `${API_BASE_URL}${apiRoutes.eventGetByPartner}?${params.toString()}`,
    { method: 'GET' }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to list events (${response.status})`);
  }
  return data;
};

/**
 * Add an event
 * @param {{ season_id: string, name: string, type: string, start_date: string, end_date: string, country: string, state?: string, city?: string, venue?: string, registration_fee?: number }} payload
 * @returns {Promise<{ success: boolean, data?: object }>}
 */
export const addEvent = async (payload) => {
  const body = {
    season_id: payload.season_id ?? '',
    name: payload.name ?? '',
    type: payload.type ?? '',
    start_date: payload.start_date ?? '',
    end_date: payload.end_date ?? '',
    country: payload.country ?? '',
    state: payload.state ?? '',
    city: payload.city ?? '',
    venue: payload.venue ?? '',
    registration_fee: payload.registration_fee ?? 0,
  };
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.event.add}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to add event (${response.status})`);
  }
  return data;
};

/**
 * Update an event (PATCH)
 * @param {string} id - Event _id
 * @param {object} payload - Partial event fields to update
 * @returns {Promise<{ success: boolean, data?: object }>}
 */
export const updateEvent = async (id, payload) => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.event.update(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to update event (${response.status})`);
  }
  return data;
};

/**
 * Delete an event
 * @param {string} _id - Event _id
 * @returns {Promise<{ success: boolean }>}
 */
export const deleteEvent = async (_id) => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.event.delete(_id)}`, {
    method: 'DELETE',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to delete event (${response.status})`);
  }
  return data;
};

/**
 * Get an event by id
 * @param {string} _id - Event _id
 * @returns {Promise<{ success: boolean, data?: object }>}
 */
export const getEvent = async (_id) => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.event.get(_id)}`, {
    method: 'GET',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to get event (${response.status})`);
  }
  return data;
};

// --- Admin dashboard: Competition API ---

/**
 * List all competitions
 * @returns {Promise<{ status?: number, success?: boolean, data?: Array }>}
 */
export const listCompetitions = async () => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.competition.list}`, {
    method: 'GET',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to list competitions (${response.status})`);
  }
  return data;
};

/**
 * List competitions by partner (competitions/get?partnerCode=XX).
 * partnerCode from partner route (e.g. /TH/admin-dashboard) or user.partner.partnerCode.
 * @param {string} partnerCode - Partner code (e.g. 'TH')
 * @returns {Promise<{ success?: boolean, data?: Array, competitions?: Array }>}
 */
export const listCompetitionsGet = async (partnerCode) => {
  const code = (partnerCode || '').toString().trim();
  if (!code) {
    return { success: true, data: [], competitions: [] };
  }
  const params = new URLSearchParams({ partnerCode: code });
  const response = await apiFetch(
    `${API_BASE_URL}${apiRoutes.competitionsGetByPartner}?${params.toString()}`,
    { method: 'GET' }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to list competitions (${response.status})`);
  }
  return data;
};

/**
 * Build FormData from competition payload for add competition.
 * Nested objects (teamRequirements, duration) and arrays (downloadTitles) are sent as JSON strings.
 * bannerImage: if it's a File, append as file; otherwise append as string if present.
 * Supports flat bracket keys: duration[value], duration[unit], teamRequirements[minMembers], teamRequirements[maxMembers], downloadTitles[0], downloadTitles[1], ...
 * @param {object} competition - Competition fields (flat or nested)
 * @returns {FormData}
 */
export const buildCompetitionFormData = (competition) => {
  const form = new FormData();

  // Support flat bracket keys (duration[value], teamRequirements[minMembers], downloadTitles[i]) or nested
  const minMembersRaw = competition['teamRequirements[minMembers]'] ?? competition.teamRequirements?.minMembers;
  const maxMembersRaw = competition['teamRequirements[maxMembers]'] ?? competition.teamRequirements?.maxMembers;
  let minMembers = Number(minMembersRaw);
  let maxMembers = Number(maxMembersRaw);
  minMembers = Number.isFinite(minMembers) && minMembers >= 0 ? minMembers : 1;
  maxMembers = Number.isFinite(maxMembers) && maxMembers >= 0 ? maxMembers : 4;
  if (minMembers > maxMembers) maxMembers = minMembers;

  const durationValueRaw = competition['duration[value]'] ?? competition.duration?.value;
  const durationUnitRaw = competition['duration[unit]'] ?? competition.duration?.unit;
  const durationValue = Number(durationValueRaw);
  const value = Number.isFinite(durationValue) && durationValue >= 0 ? durationValue : 1;
  const unit = (typeof durationUnitRaw === 'string' && durationUnitRaw) ? durationUnitRaw : (typeof durationUnitRaw === 'number' && Number.isFinite(durationUnitRaw)) ? String(durationUnitRaw) : 'day';

  const prizePool = Number(competition.prizePool);
  const prizePoolNum = Number.isFinite(prizePool) && prizePool >= 0 ? prizePool : 0;

  // downloadTitles: from array or from flat keys downloadTitles[0], downloadTitles[1], ...
  let downloadTitles = competition.downloadTitles ?? [];
  if (!Array.isArray(downloadTitles) || downloadTitles.length === 0) {
    downloadTitles = [];
    let i = 0;
    while (competition[`downloadTitles[${i}]`] !== undefined) {
      downloadTitles.push(competition[`downloadTitles[${i}]`]);
      i += 1;
    }
  }

  form.append('name', competition.name ?? '');
  form.append('category', competition.category ?? '');
  form.append('description', competition.description ?? '');
  form.append('prizePool', String(prizePoolNum));
  form.append('teamRequirements[minMembers]', String(minMembers));
  form.append('teamRequirements[maxMembers]', String(maxMembers));
  form.append('duration[value]', String(value));
  form.append('duration[unit]', unit);
  downloadTitles.forEach((title, i) => form.append(`downloadTitles[${i}]`, title));
  form.append('rulesAndRegulations', competition.rulesAndRegulations ?? '');
  form.append('trainingResourseUrl', competition.trainingResourseUrl ?? '');
  form.append('pastWinnerUrl', competition.pastWinnerUrl ?? '');
  form.append('globalRankingeUrl', competition.globalRankingeUrl ?? '');
  form.append('hasBots', competition.hasBots !== undefined ? String(competition.hasBots) : 'false');
  form.append('isActive', competition.isActive !== undefined ? String(competition.isActive) : 'true');
  const eventId = competition.event_id ?? competition.eventId ?? '';
  form.append('event_id', eventId);
  form.append('season_id', competition.season_id ?? competition.seasonId ?? '');
  // Backend requires 'events' (array of event IDs)
  const eventsArr = eventId ? [eventId] : [];
  form.append('events', JSON.stringify(eventsArr));

  const bannerImage = competition.bannerImage;
  if (bannerImage instanceof File) {
    form.append('bannerImage', bannerImage);
  } else if (bannerImage && typeof bannerImage === 'string') {
    form.append('bannerImage', bannerImage);
  }

  return form;
};

/**
 * Add a competition (payload sent as FormData)
 * @param {object} competition - Competition fields (see buildCompetitionFormData); bannerImage can be File or string
 * @returns {Promise<{ success: boolean, data?: object }>}
 */
export const addCompetition = async (competition) => {
  const formData = buildCompetitionFormData(competition);
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.competition.add}`, {
    method: 'POST',
    body: formData,
    // Do not set Content-Type; browser sets multipart/form-data with boundary
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to add competition (${response.status})`);
  }
  return data;
};

/**
 * Update a competition (PUT, payload sent as FormData)
 * Endpoint: PUT /api/competition/update/{_id} (e.g. https://worso-backend-rm6w.vercel.app/api/competition/update/{_id})
 * @param {string} _id - Competition _id
 * @param {object} competition - Competition fields (flat bracket keys or nested); bannerImage can be File or string
 * @returns {Promise<{ success: boolean, data?: object }>}
 */
export const updateCompetition = async (_id, competition) => {
  const formData = buildCompetitionFormData(competition);
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.competition.update(_id)}`, {
    method: 'PUT',
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to update competition (${response.status})`);
  }
  return data;
};

/**
 * Delete a competition
 * @param {string} _id - Competition _id
 * @returns {Promise<{ success: boolean }>}
 */
export const deleteCompetition = async (_id) => {
  const response = await apiFetch(`${API_BASE_URL}${apiRoutes.competition.delete(_id)}`, {
    method: 'DELETE',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Failed to delete competition (${response.status})`);
  }
  return data;
};
