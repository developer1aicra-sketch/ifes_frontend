// src/api/axiosClient.js
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getAuthToken } from './authToken';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "https://worso-backend-rm6w.vercel.app/api/",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Protected endpoints require Authorization: Bearer <token> (token from /auth/signup/verify/otp)
const protectedEndpoints = [
  '/signup',        // POST /signup requires Bearer token from verify OTP
  '/signup/step2',
  '/payment/create',
  '/payments/verify',
  '/club/add',
  '/club/my/get',
  '/membership/my/get',
];

// Add request interceptor: attach Bearer token from authToken (set after verify OTP)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (config.url) {
        console.log(`🔐 Adding Authorization Bearer to request: ${config.method?.toUpperCase()} ${config.url}`);
      }
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
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
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