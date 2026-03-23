import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Create partner enquiry — POST /partner/create/enquiry
 * Payload: { name, organisationName, email, mobile, country, state, city, partnershipType, remarks }
 * @param {Object} payload - Enquiry data
 * @param {string} payload.name - Contact person name
 * @param {string} payload.organisationName - Organisation name
 * @param {string} payload.email - Email address
 * @param {string} payload.mobile - Mobile number (digits only)
 * @param {string} payload.country - Country name (e.g. "India")
 * @param {string} payload.state - State/region name
 * @param {string} payload.city - City name
 * @param {string} payload.partnershipType - DISTRICT_FRANCHISE | INTERNATIONAL
 * @param {string} [payload.remarks] - Optional additional remarks
 * @returns {Promise<{ success: boolean, data?: Object }>}
 */
export const createPartnerEnquiry = (payload) =>
  axiosInstance.post(endpoints.partners.createEnquiry, payload);
