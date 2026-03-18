import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Student Community Directory
 * GET /all-users-data?page=&limit=&search=
 *
 * @param {{ page?: number, limit?: number, search?: string }} params
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const getCommunityDirectoryUsers = (params = {}) => {
  const page = params?.page != null ? Number(params.page) : 1;
  const limit = params?.limit != null ? Number(params.limit) : 10;
  const search = typeof params?.search === 'string' ? params.search.trim() : '';

  return axiosInstance.get(endpoints.directory.allUsers, {
    params: {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
      ...(search ? { search } : {}),
    },
  });
};

