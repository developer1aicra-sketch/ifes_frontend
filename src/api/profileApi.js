import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Update logged-in member profile.
 * Maps directly to PUT /api/profile/update.
 *
 * @param {Object|FormData} payload - Profile update payload. Prefer FormData (supports logo upload + nested JSON).
 * @returns {Promise} Axios response
 */
export const updateProfile = (payload) =>
  axiosInstance.put(endpoints.profile.update, payload);

