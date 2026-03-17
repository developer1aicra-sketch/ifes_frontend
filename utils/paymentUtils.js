/**
 * Payment utilities for Razorpay integration.
 * Normalizes /payment/create API response so frontend always gets a consistent shape.
 *
 * API may return either:
 * - amount (in paise) — legacy
 * - totalAmount (in rupees) — current shape
 *
 * Razorpay checkout expects amount in paise. This util ensures we always pass paise.
 */

/**
 * Normalize payment create API response to a consistent shape for Razorpay checkout.
 *
 * @param {Object} data - Raw data from POST /payment/create response.data
 * @returns {Object} Normalized shape:
 *   - paymentId: string
 *   - orderId: string
 *   - amount: number (always in paise for Razorpay)
 *   - currency: string
 *   - razorpayKey: string
 *   - totalAmountRupees: number (for display)
 *   - createdItems: string[]
 *   - skippedItems: string[]
 *   - ...rest of API fields (userName, userEmail, userPhone, etc.)
 */
export function normalizePaymentCreateResponse(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid payment response: No data');
    }
  
    const {
      paymentId,
      orderId,
      amount: amountPaise,
      totalAmount: totalAmountRupees,
      currency = 'INR',
      razorpayKey,
      createdItems = [],
      skippedItems = [],
      ...rest
    } = data;
  
    if (!razorpayKey || !orderId) {
      throw new Error('Invalid payment response: Missing razorpayKey or orderId');
    }
  
    // Razorpay expects amount in paise (integer).
    // API may send amount (paise) or totalAmount (rupees).
    let amountInPaise = amountPaise;
    if (amountInPaise == null || amountInPaise <= 0) {
      if (totalAmountRupees != null && totalAmountRupees > 0) {
        amountInPaise = Math.round(Number(totalAmountRupees) * 100);
      } else {
        throw new Error('Invalid payment response: Missing or invalid amount/totalAmount');
      }
    } else {
      amountInPaise = Math.round(Number(amountInPaise));
    }
  
    return {
      paymentId: paymentId || rest.paymentId,
      orderId,
      amount: amountInPaise,
      currency,
      razorpayKey,
      totalAmountRupees: totalAmountRupees != null ? Number(totalAmountRupees) : amountInPaise / 100,
      createdItems: Array.isArray(createdItems) ? createdItems : [],
      skippedItems: Array.isArray(skippedItems) ? skippedItems : [],
      ...rest,
    };
  }
  
  /**
   * Format amount in paise to display string in rupees (or other currency).
   * @param {number} amountPaise
   * @param {string} currency
   * @returns {string} e.g. "9096.54"
   */
  export function formatAmountFromPaise(amountPaise, currency = 'INR') {
    if (amountPaise == null) return '0.00';
    return (Number(amountPaise) / 100).toFixed(2);
  }
  
  /**
   * Build payload for POST /payments/verify after a successful Razorpay payment.
   * Use this in the Razorpay success handler: verifyPayment(buildPaymentVerifyPayload(razorpayResponse)).
   *
   * Frontend flow: Payment submitted in Razorpay → on success → verifyPayment(buildPaymentVerifyPayload(response)) → then run onPaymentSuccess callback.
   *
   * @param {Object} razorpayResponse - Response from Razorpay checkout handler
   * @param {string} razorpayResponse.razorpay_payment_id
   * @param {string} razorpayResponse.razorpay_order_id
   * @param {string} razorpayResponse.razorpay_signature
   * @returns {{ paymentId: string, orderId: string, signature: string }}
   */
  export function buildPaymentVerifyPayload(razorpayResponse) {
    if (!razorpayResponse || typeof razorpayResponse !== 'object') {
      throw new Error('Invalid Razorpay response for verification');
    }
    const paymentId = razorpayResponse.razorpay_payment_id;
    const orderId = razorpayResponse.razorpay_order_id;
    const signature = razorpayResponse.razorpay_signature;
    if (!paymentId || !orderId || !signature) {
      throw new Error('Razorpay response missing paymentId, orderId, or signature');
    }
    return { paymentId, orderId, signature };
  }
  