import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Fetch all plans (flat list with populated categoryId).
 * Response: { success, data: Plan[] }
 * Plan: { _id, categoryId: { _id, name, description }, title, name, price, duration, benefits, isActive, ... }
 */
export const fetchPlans = () =>
  axiosInstance.get(endpoints.plans.list);
