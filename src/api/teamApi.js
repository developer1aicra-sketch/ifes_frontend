import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Create a new team
 * 
 * Note: This API requires Authorization Bearer token in the header.
 * The token is automatically added from localStorage via axiosInstance interceptor.
 * Token is obtained from /api/signup response and stored in localStorage.
 * 
 * @param {Object} teamData - Team data payload
 * @param {string} teamData.teamName - Team name (required)
 * @param {string|number} teamData.club_id - Club ID (required)
 * @param {string|number} teamData.competition_id - Competition ID (required)
 * @param {string|number} teamData.captain_id - Captain/User ID (required)
 * @returns {Promise} Axios response with created team data
 * 
 * @example
 * createTeam({ 
 *   teamName: "Ashutosh Robo players",
 *   club_id: "club-123",
 *   competition_id: "comp-456",
 *   captain_id: "user-789"
 * })
 */
export const createTeam = (teamData) => {
  console.log('🌐 Making API call to:', endpoints.team.add);
  console.log('📦 Request payload:', teamData);
  console.log('🔐 Token will be automatically added from localStorage');
  
  return axiosInstance.post(endpoints.team.add, teamData);
};

/**
 * Get team list (GET /team/list).
 * Optional club_id query to filter teams by club.
 * @param {{ club_id?: string }} params - Optional; pass { club_id } to filter by club
 * @returns {Promise} Axios response; response.data typically { success, data: Team[] } or Team[]
 */
export const getTeamList = (params = {}) => {
  const config = params?.club_id
    ? { params: { club_id: params.club_id } }
    : {};
  return axiosInstance.get(endpoints.team.list, config);
};

/**
 * Update an existing team (PATCH /team/update/{_id}).
 * Requires Authorization Bearer token (added automatically from localStorage).
 *
 * @param {string} teamId - Team _id to update
 * @param {Object} teamData - Fields to update (e.g. teamName, description only)
 * @returns {Promise} Axios response with updated team data
 */
export const updateTeam = (teamId, teamData) => {
  const url = endpoints.team.update(teamId);
  return axiosInstance.patch(url, teamData);
};
