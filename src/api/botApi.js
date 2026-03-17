import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Get list of available bots.
 * Response: { success: boolean, count: number, data: Bot[] }
 * Bot: { _id, name, competition_id: { _id, name }, specs: { maxWeight }, isActive, createdAt, updatedAt }
 */
export const getBotsList = () =>
  axiosInstance.get(endpoints.bot.list);
