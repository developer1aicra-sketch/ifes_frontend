import axiosInstance from '../../api/axiosInstance';
import endpoints from '../../api/endpoints';

export const signUpSendOtp = (data) =>
  axiosInstance.post(endpoints.signupAuth.sendOtp, data);

/**
 * Verify signup OTP. Response must contain token; it is stored and sent as Bearer for /signup.
 * @returns {Promise} Axios response - response.data or response.data.data may contain { token }
 */
export const signUpVerifyOtp = (data) =>
  axiosInstance.post(endpoints.signupAuth.verifyOtp, data);

/**
 * Step 1: Create account with email + password.
 * POST /api/auth/signup. Returns token and user (e.g. user._id). Token must be stored for subsequent calls.
 * @param {{ email: string, password: string }} data
 * @returns {Promise} Axios response - response.data.data or response.data may contain { token, user: { _id } }
 */
export const authSignup = (data) =>
  axiosInstance.post(endpoints.signupAuth.authSignup, data);

/**
 * Step 2: Submit profile (category, designation, fullName, mobile, plan).
 * PUT /api/signup/step2. Requires Authorization: Bearer token from auth/signup.
 * @param {{ categoryId: string, designation: string, fullName: string, mobile: string, planId: string }} data
 */
export const signupStep2 = (data) =>
  axiosInstance.put(endpoints.signupAuth.signupStep2, data);

/**
 * Step 3: Submit shipping/affiliation (FormData).
 * Requires Authorization: Bearer token.
 * @param {FormData} data
 */
export const signupStep3 = (data) => {
  return axiosInstance.put(endpoints.signupAuth.signupStep3, data, {
    transformRequest: (data, reqHeaders) => {
      if (data instanceof FormData) {
        delete reqHeaders['Content-Type'];
      }
      return data;
    }
  });
};

/**
 * Complete signup (legacy OTP flow). Requires Authorization: Bearer <token> (token from verify OTP response).
 * Token is attached automatically by axios interceptor from authToken.
 */
export const signUp = (data) =>
  axiosInstance.put(endpoints.signupAuth.signup, data);

/**
 * Submit step 3 of signup - shipping information (legacy name kept for backward compatibility).
 * @param {FormData|Object} data - Form data containing shipping information
 * @returns {Promise} Axios response
 */
export const signUpStep2 = (data) => {
  return signupStep3(data);
};

export const loginSendOtp = (data) => 
  axiosInstance.post(endpoints.loginAuth.sendOtp, data);

export const loginVerifyOtp = (data) =>
  axiosInstance.post(endpoints.loginAuth.verifyOtp, data);

export const initiateMembership = (data) =>
  axiosInstance.post(endpoints.membership.initiate, data);

export const login = (payload) =>
  axiosInstance.post(endpoints.loginAuth.login, payload);

/**
 * Get user's membership details
 * 
 * Note: This API requires Authorization token in the header.
 * The token is automatically added from localStorage via axiosInstance interceptor.
 * 
 * @returns {Promise} Axios response containing membership data
 */
export const getMyMembership = () =>
  axiosInstance.get(endpoints.membership.myGet);