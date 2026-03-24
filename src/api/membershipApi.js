import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Create bulk memberships.
 * Payload: { members: Array<{ user_id: string, category_id: string, plan_id: string }> }
 * Requires: Authorization Bearer token.
 * Response: { success, data?, message? }
 */
export const createBulkMembership = (payload) =>
  axiosInstance.post(endpoints.membership.bulk, payload);

/**
 * Get current logged-in user's own membership.
 * Requires: Authorization Bearer token.
 * Response: {
 *   success,
 *   data: {
 *     publicMembershipId,
 *     category,
 *     planTitle,
 *     planName,
 *     status,
 *     paymentStatus,
 *     startDate,
 *     endDate,
 *     benefits,     // string[]
 *     price,        // { amount: number, currency: string }
 *     duration,     // { value: number, unit: string }
 *     createdAt
 *   }
 * }
 */
export const getMyMembership = () =>
  axiosInstance.get(endpoints.membership.myGet);

/**
 * Get memberships by partner.
 * Endpoint: /memberships/get?partnerCode=XX&page=&limit=
 * @param {string} partnerCode - Partner code (e.g. 'IN')
 * @param {{ page?: number, limit?: number }} options
 */
export const getMembershipsByPartner = (partnerCode, options = {}) => {
  const code = (partnerCode || '').toString().trim();
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 9;

  return axiosInstance.get(endpoints.memberships.get, {
    params: {
      partnerCode: code,
      page,
      limit,
    },
  });
};
