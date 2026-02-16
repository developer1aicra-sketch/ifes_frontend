import axiosInstance from '../../api/axiosInstance';
import endpoints from '../../api/endpoints';

export const fetchCategories = () => axiosInstance.get(endpoints.categories.list);

/**
 * Fetch a single category by ID
 * IMPORTANT: This API should NOT be called with "razorpay" as categoryId
 * @param {string} categoryId - Category ID (must not be "razorpay")
 * @returns {Promise} Axios response
 */
export const fetchCategory = (categoryId) => {
  // Prevent calling category API with "razorpay" as ID
  if (categoryId === 'razorpay' || categoryId === 'Razorpay' || categoryId === 'RAZORPAY') {
    throw new Error('Invalid category ID: "razorpay" is not a valid category. This API endpoint should not be called with payment gateway names.');
  }
  
  // Validate categoryId is not empty or undefined
  if (!categoryId || typeof categoryId !== 'string' || categoryId.trim() === '') {
    throw new Error('Invalid category ID: Category ID is required and must be a non-empty string.');
  }
  
  return axiosInstance.get(endpoints.categories.details(categoryId));
};