import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Update logged-in member profile.
 * Maps directly to PUT /api/profile/update.
 *
 * @param {Object} payload - Profile update payload
 * @returns {Promise} Axios response
 */
export const updateProfile = (payload) =>
  axiosInstance.put(endpoints.profile.update, payload);

