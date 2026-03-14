import axiosInstance from '../../api/axiosInstance';
import endpoints from '../../api/endpoints';

/**
 * Get current user's membership details.
 * Wraps GET /membership/my/get.
 * Requires Authorization token (handled by axiosInstance interceptors).
 */
export const getMyMembership = () =>
  axiosInstance.get(endpoints.membership.myGet);

