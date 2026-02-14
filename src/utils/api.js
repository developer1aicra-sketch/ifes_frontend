// API utility functions

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://worso-backend-psi.vercel.app/api';

/**
 * Fetches partners data from the API
 * @returns {Promise<{success: boolean, partners: Array, pagination: Object}>}
 */
export const fetchPartners = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/partners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_BASE_URL}/partners/${identifier}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
  
  return partners.filter(
    partner => partner.location === locationCode && partner.isActive
  );
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
  } catch (_) {}

  return { locationCode: null, partner: null };
};
