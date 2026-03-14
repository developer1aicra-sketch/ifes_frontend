import axiosInstance from '../../api/axiosInstance';
import endpoints from '../../api/endpoints';
import { createPayment } from '../../api/paymentApi';

/**
 * Get current user's membership details.
 * Wraps GET /membership/my/get.
 * Requires Authorization token (handled by axiosInstance interceptors).
 */
export const getMyMembership = () =>
  axiosInstance.get(endpoints.membership.myGet);

/**
 * Create membership in bulk (POST /api/membership/bulk). Called before payment/create.
 * Requires Authorization: Bearer token.
 * @param {{ members: Array<{ user_id: string, category_id: string, plan_id: string }> }} payload
 * @returns {Promise} Axios response. Shape: { success, message, totalCreated, createdMemberships: [{ _id, plan_id, category_id, ... }], failedUsers }
 */
export const membershipBulk = (payload) =>
  axiosInstance.post(endpoints.membership.bulk, payload);

/**
 * Checkout flow: run /api/membership/bulk then immediately /api/payment/create with _id and plan_id from bulk response.
 * Bulk response shape: { success, message, createdMemberships: [{ _id, plan_id, category_id, ... }], failedUsers }.
 * We take _id, plan_id, category_id from createdMemberships[0], call payment/create with items: [{ membership_id, plan_id, category_id }], then UI opens payment gateway.
 *
 * @param {{ userId: string, categoryId: string, planId: string }} params
 *   Backend derives amount from plan/membership; do not send amount in /payment/create payload.
 * @returns {Promise<{ membershipId: string, planId: string, categoryId: string, paymentResponse: import('axios').AxiosResponse }>}
 */
export async function createMembershipThenPayment(params) {
  const { userId, categoryId, planId } = params;

  const bulkRes = await membershipBulk({
    members: [
      { user_id: userId, category_id: categoryId, plan_id: planId },
    ],
  });
  const resData = bulkRes?.data;

  // Parse bulk response: { success, createdMemberships: [{ _id, plan_id, category_id, ... }], ... }
  const created = resData?.createdMemberships?.[0];
  const membershipId = created?._id ?? resData?.data?.createdMemberships?.[0]?._id;
  const planIdFromBulk = created?.plan_id ?? planId;
  const categoryIdFromBulk = created?.category_id ?? categoryId;

  if (!membershipId) {
    const msg =
      resData?.message || 'Could not create membership. Invalid response from server.';
    console.error('Membership bulk response (expected createdMemberships[0]._id):', resData);
    throw new Error(msg);
  }

  const idempotencyKey = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  const paymentPayload = {
    purchase_type: 'MEMBERSHIP',
    gateway: 'RAZORPAY',
    currency: 'INR',
    idempotencyKey,
    items: [
      {
        membership_id: membershipId,
        plan_id: planIdFromBulk,
        category_id: categoryIdFromBulk,
      },
    ],
  };
  const paymentResponse = await createPayment(paymentPayload);
  return {
    membershipId,
    planId: planIdFromBulk,
    categoryId: categoryIdFromBulk,
    paymentResponse,
  };
}

