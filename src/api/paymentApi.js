import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Create payment order (POST /api/payment/create).
 * Called on "Complete Registration" after /api/membership/bulk.
 * Requires Authorization token (added by axios interceptor).
 *
 * @param {Object} payload - Payment payload (purchase_type, gateway, currency, idempotencyKey, items). Do not send amount; backend derives it.
 * @returns {Promise} Axios response
 *
 * Expected response shape (used for Razorpay checkout):
 * {
 *   success: true,
 *   data: {
 *     paymentId: string,   // backend payment id
 *     orderId: string,     // Razorpay order_id
 *     amount: number,      // paise
 *     currency: string,    // "INR"
 *     razorpayKey: string, // Razorpay key
 *     userName: string
 *   }
 * }
 */
export const createPayment = (payload) => {
  return axiosInstance.post(endpoints.payment.create, payload);
};

/**
 * Normalize /payment/create response to a single data object for Razorpay.
 * Handles both { success: true, data: {...} } and { data: {...} } shapes.
 * Amount is optional in response; frontend may use plan-derived amount for Razorpay if missing.
 *
 * @param {import('axios').AxiosResponse} response
 * @returns {{ paymentId: string, orderId: string, amount?: number, currency: string, razorpayKey: string, userName?: string }}
 */
export function normalizePaymentCreateResponse(response) {
  const res = response?.data;
  const data = res?.success === true ? res.data : res?.data ?? res;
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid payment response: No data received');
  }
  if (!data.razorpayKey) throw new Error('Invalid payment response: Missing razorpayKey');
  if (!data.orderId) throw new Error('Invalid payment response: Missing orderId');
  const amount =
    data.amount != null && Number(data.amount) > 0 ? Number(data.amount) : undefined;
  return {
    paymentId: data.paymentId,
    orderId: data.orderId,
    amount,
    currency: data.currency || 'INR',
    razorpayKey: data.razorpayKey,
    userName: data.userName,
  };
}

/**
 * Verify payment after successful Razorpay transaction (POST /payments/verify)
 *
 * Called from frontend after Razorpay handler returns success.
 * Token is automatically added from localStorage via axiosInstance interceptor.
 *
 * @param {Object} payload - Verification payload (Razorpay response fields)
 * @param {string} payload.paymentId - Razorpay payment ID (response.razorpay_payment_id)
 * @param {string} payload.orderId - Razorpay order ID (response.razorpay_order_id)
 * @param {string} payload.signature - Razorpay signature (response.razorpay_signature)
 * @returns {Promise} Axios response
 */
export const verifyPayment = (payload) => {
  return axiosInstance.post(endpoints.payment.verify, payload);
};
