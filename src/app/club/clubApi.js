import axiosInstance from '../../api/axiosInstance';
import endpoints from '../../api/endpoints';

/**
 * Add/Register a new RoboClub
 * 
 * Note: This API requires Authorization token in the header.
 * The token is automatically added from localStorage via axiosInstance interceptor.
 * Token is obtained from /auth/signup/verify/otp response and stored in localStorage.
 * 
 * @param {Object} data - Club registration data containing:
 *   - name: string (user name)
 *   - clubName: string
 *   - instituteName: string
 *   - countryCode: string
 *   - state: string
 *   - city: string
 *   - mobile: string
 * @returns {Promise} Axios response containing club data
 */
export const addClub = (data) =>
  axiosInstance.post(endpoints.club.add, data);

/**
 * Get user's club details
 * 
 * Note: This API requires Authorization token in the header.
 * The token is automatically added from localStorage via axiosInstance interceptor.
 * 
 * @returns {Promise} Axios response containing club data
 */
export const getMyClub = () =>
  axiosInstance.get(endpoints.club.myGet);
