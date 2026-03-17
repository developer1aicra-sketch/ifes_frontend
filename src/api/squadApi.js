import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Get a single squad by id (GET /squad/get/:id).
 * Requires Authorization Bearer token.
 * Response: { success, data: Squad }
 */
export const getSquadById = (id) =>
  axiosInstance.get(endpoints.squad.getById(id));

/**
 * Get squads/teams for a club (GET /squad/club/:clubId).
 * Requires Authorization Bearer token.
 * Response: { success, count, data: Squad[] }
 * Squad: { _id, club_id, teamName, category, event_id, competition_id, lineup, entry_fee, status, payment, captain, members[], bot }
 */
export const getSquadsByClub = (clubId) =>
  axiosInstance.get(endpoints.squad.listByClub(clubId));

/**
 * Get a single squad/team details (GET /squad/clubs/:clubId/teams/:teamId).
 * Used for edit squad page to pre-fill form.
 */
export const getSquadDetails = (clubId, teamId) =>
  axiosInstance.get(endpoints.squad.teams.details(clubId, teamId));

/**
 * Delete a squad by id (DELETE /squad/delete/:id).
 * Requires Authorization Bearer token.
 */
export const deleteSquad = (id) => {
  const squadId = String(id ?? '').trim();
  if (!squadId) throw new Error('Squad _id is required for delete');
  return axiosInstance.delete(endpoints.squad.delete(squadId));
};

/**
 * Update a squad by id with full payload (PATCH /squad/update/:id).
 * Payload shape: { club_id, category, teamName, event_id, competition_id, lineup: { bot_id, captain_id, members }, entry_fee }
 */
export const updateSquad = (id, payload) => {
  const squadId = String(id ?? payload._id ?? payload.id ?? '').trim();
  if (!squadId) {
    throw new Error('Squad _id is required for update');
  }

  const body = {
    club_id: String(payload.club_id ?? payload.clubId ?? '').trim(),
    category: String(payload.category ?? 'Senior'),
    teamName: String(payload.teamName ?? payload.name ?? '').trim(),
    event_id: String(payload.event_id ?? ''),
    competition_id: String(payload.competition_id ?? ''),
    lineup: {
      bot_id: String(payload.lineup?.bot_id ?? ''),
      captain_id: String(payload.lineup?.captain_id ?? payload.captain_id ?? '').trim(),
      members: Array.isArray(payload.lineup?.members) ? payload.lineup.members.map((m) => String(m)) : [],
    },
    entry_fee: Number(payload.entry_fee) ?? 500,
  };

  return axiosInstance.patch(endpoints.squad.update(squadId), body);
};

/**
 * Get squads for the current logged-in user (GET /squad/get/my).
 * Requires Authorization Bearer token.
 * Response: { success, data: Squad[] }
 */
export const getMySquads = () =>
  axiosInstance.get(endpoints.squad.myGet);
