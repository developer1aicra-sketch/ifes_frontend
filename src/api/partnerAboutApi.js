import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Add partner about content.
 * Payload: { heading: string, content: string }
 */
export const addPartnerAbout = (payload) =>
  axiosInstance.post(endpoints.partnerAbout.add, payload);

/**
 * Get partner about content list.
 * Query: { website: string, partnerCode: string }
 */
export const getPartnerAbout = (website = 'worso', partnerCode = 'IN') =>
  axiosInstance.get(endpoints.partnerAbout.get, {
    params: { website, partnerCode },
  });

/**
 * Update partner about content by id.
 * Payload: { heading: string, content: string }
 */
export const updatePartnerAbout = (aboutId, payload) =>
  axiosInstance.put(endpoints.partnerAbout.update(aboutId), payload);

/**
 * Delete partner about content by id.
 */
export const deletePartnerAbout = (aboutId) =>
  axiosInstance.delete(endpoints.partnerAbout.delete(aboutId));
