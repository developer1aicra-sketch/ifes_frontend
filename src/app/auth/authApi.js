import axiosInstance from '../../api/axiosInstance';
import endpoints from '../../api/endpoints';

export const signUpSendOtp = (data) => 
  axiosInstance.post(endpoints.signupAuth.sendOtp, data);

export const signUpVerifyOtp = (data) =>
  axiosInstance.post(endpoints.signupAuth.verifyOtp, data);

export const signUp = (data) =>
  axiosInstance.post(endpoints.signupAuth.signup, data);

/**
 * Submit step 2 of signup (shipping information)
 * 
 * Note: This API requires Authorization token in the header.
 * The token is automatically added from localStorage via axiosInstance interceptor.
 * Token is obtained from /api/signup response and stored in localStorage.
 * 
 * @param {FormData|Object} data - Form data containing shipping information
 * @returns {Promise} Axios response
 */
export const signUpStep2 = (data) => {
  // For FormData, axios will automatically detect it and set Content-Type to multipart/form-data with boundary
  // We use transformRequest to ensure the default JSON Content-Type is removed for FormData
  // No custom headers - only Content-Type will be auto-set by axios for FormData
  // Authorization token is automatically added by axiosInstance interceptor
  return axiosInstance.put(endpoints.signupAuth.step2, data, {
    transformRequest: (data, reqHeaders) => {
      // If data is FormData, remove Content-Type header so axios can set it with boundary
      if (data instanceof FormData) {
        delete reqHeaders['Content-Type'];
      }
      return data;
    }
  });
};

export const loginSendOtp = (data) => 
  axiosInstance.post(endpoints.loginAuth.sendOtp, data);

export const loginVerifyOtp = (data) =>
  axiosInstance.post(endpoints.loginAuth.verifyOtp, data);

export const initiateMembership = (data) =>
  axiosInstance.post(endpoints.membership.initiate, data);