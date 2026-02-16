import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Create payment order with Razorpay
 * 
 * Note: This API requires Authorization token in the header.
 * The token is automatically added from localStorage via axiosInstance interceptor.
 * Token is obtained from /api/signup response and stored in localStorage.
 * 
 * @param {Object} payload - Payment payload
 * @param {string} payload.gateway - Payment gateway (e.g., "RAZORPAY")
 * @param {string} payload.currency - Currency code (e.g., "INR", "USD")
 * @returns {Promise} Axios response
 */
export const createPayment = (payload) => {
  return axiosInstance.post(endpoints.payment.create, payload);
};

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
