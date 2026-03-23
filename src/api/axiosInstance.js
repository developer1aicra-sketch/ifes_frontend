// src/api/axiosClient.js
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getAuthHeader } from './authToken';
import { getLocationCodeFromPath } from '../utils/locationRoutes';
import { getPartnerCode } from './partnerCode';

const setRequestHeader = (headers, key, value) => {
  // Axios v1 uses AxiosHeaders (has .set/.delete). Older/other configs can be plain objects.
  if (!headers) return { [key]: value };
  if (typeof headers.set === 'function') {
    headers.set(key, value);
    return headers;
  }
  headers[key] = value;
  return headers;
};

const deleteRequestHeader = (headers, key) => {
  if (!headers) return headers;
  if (typeof headers.delete === 'function') {
    headers.delete(key);
    return headers;
  }
  try {
    delete headers[key];
  } catch {
    // no-op
  }
  return headers;
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "https://worso-backend-rm6w.vercel.app/api/",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-website': 'worso',
    'x-partner-code': '' // set per-request from route in interceptor
  },
});

// Protected endpoints require Authorization: Bearer <token> (token from /auth/signup)
const protectedEndpoints = [
  '/signup',
  '/signup/step2',
  '/signup/step3',
  '/payment/create',
  '/payments/verify',
  '/club/add',
  '/club/add/admin',
  '/club/my/get',
  '/membership/my/get',
  '/membership/bulk',
  '/profile/update',
  // Squad/Team flows (require auth)
  '/squad',
  '/team',
];

// Add request interceptor: attach Bearer token from authToken (set after verify OTP)
axiosInstance.interceptors.request.use(
  (config) => {
    // Set x-partner-code from current route (e.g. /VE or /VE/technoxian → "VE")
    if (typeof window !== 'undefined' && window.location?.pathname) {
      const partnerCodeFromRoute = getLocationCodeFromPath(window.location.pathname);
      const partnerCode = getPartnerCode() || partnerCodeFromRoute;
      config.headers = setRequestHeader(config.headers, 'x-partner-code', partnerCode || '');
      console.log('partnerCode', partnerCode);
    }
   
    const authHeader = getAuthHeader();
    if (authHeader.Authorization) {
      config.headers = setRequestHeader(config.headers, 'Authorization', authHeader.Authorization);
    } else {
      const isProtectedEndpoint = protectedEndpoints.some(endpoint => config.url?.includes(endpoint));
      if (isProtectedEndpoint) {
        console.warn(`⚠️ No auth token for protected endpoint: ${config.url}`);
      }
    }
    // IMPORTANT: Never manually set multipart boundary.
    // If request body is FormData, let the browser/axios set Content-Type with boundary.
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      // Axios headers can be case-insensitive; remove both to be safe.
      try {
        config.headers = deleteRequestHeader(config.headers, 'Content-Type');
        config.headers = deleteRequestHeader(config.headers, 'content-type');
      } catch {
        // no-op
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configure retry logic
axiosRetry(axiosInstance, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    return retryCount * 1000; // time interval between retries
  },
  retryCondition: (error) => {
    // Retry only on network errors or 5xx status codes
    return axiosRetry.isNetworkError(error) ||
      axiosRetry.isRetryableError(error) ||
      (error.response && error.response.status >= 500);
  },
});

export default axiosInstance;