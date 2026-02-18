/**
 * API route paths for admin dashboard (season, event, competition).
 * Base URL is applied in api.js; these are path segments only.
 */
export const apiRoutes = {
  season: {
    list: '/season/list',
    add: '/season/add',
    get: (id) => `/season/get/${id}`,
    edit: (id) => `/season/update/${id}`,
    delete: (id) => `/season/delete/${id}`,
  },
  event: {
    list: '/event/list',
    add: '/event/add',
    update: (id) => `/event/update/${id}`,
    get: (_id) => `/event/get/${_id}`,
    delete: (_id) => `/event/delete/${_id}`,
  },
  competition: {
    list: '/competition/list',
    add: '/competition/add',
    /** PUT https://worso-backend-rm6w.vercel.app/api/competition/update/{_id} */
    update: (_id) => `/competition/update/${_id}`,
    delete: (_id) => `/competition/delete/${_id}`,
  },
};
