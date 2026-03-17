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
