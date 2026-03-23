/**
 * Event API — admin dashboard event CRUD and listing.
 * Uses axiosInstance (x-website, x-partner-code, Bearer token injected).
 */

import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * List all events (super admin, no website filter).
 * GET /api/event/list
 * @returns {Promise<{ data?: Array, success?: boolean }>}
 */
export const getEventsList = () =>
  axiosInstance.get(endpoints.event.list);

/**
 * Get events by partner.
 * GET /api/event/get?website=worso&partnerCode=EG
 * @param {string} partnerCode - Partner code (e.g. 'EG', 'TH')
 * @returns {Promise<{ data?: Array, events?: Array, success?: boolean }>}
 */
export const getEventsByWebsite = (partnerCode) => {
  const code = (partnerCode || '').toString().trim();
  return axiosInstance.get(endpoints.event.get, {
    params: code ? { website: 'worso', partnerCode: code } : {},
  });
};
