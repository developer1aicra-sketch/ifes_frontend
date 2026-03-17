import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

/**
 * Register a new club (RoboClub registration form).
 * Payload: { name, clubName, instituteName, countryCode, country, state, city, mobile, email, password }
 */
export const addClub = (data) =>
  axiosInstance.post(endpoints.club.add, data);

/**
 * Get current user's clubs. Requires Authorization Bearer token.
 * Response: { success, data: Club[] }
 */
export const getMyClubs = () =>
  axiosInstance.get(endpoints.club.myGet);

/**
 * Get club details by club ID.
 * Requires: Authorization Bearer token.
 * Response: { success, data: Club }
 */
export const getClubById = (clubId) =>
  axiosInstance.get(endpoints.club.getById(clubId));

/**
 * Update club details by club ID.
 * Payload: { name, clubName, ... } (partial update supported)
 * Requires: Authorization Bearer token.
 * Response: { success, data: Club }
 */
export const updateClub = (clubId, data) =>
  axiosInstance.put(endpoints.club.update(clubId), data);

/**
 * Get club members by club ID.
 * Requires: Authorization Bearer token.
 * Response: { success, count, data: ClubMember[] }
 * ClubMember: { _id, club_id: { _id, clubName }, user_id: { _id, email }, role, status, createdAt, updatedAt }
 */
export const getClubMembers = (clubId) =>
  axiosInstance.get(endpoints.club.members(clubId));

/**
 * Add a member to a club.
 * Payload: { club_id, fullname, emailId, role }
 * Requires: Authorization Bearer token.
 * Response: { success, data: ClubMember }
 */
export const addClubMember = (memberData) =>
  axiosInstance.post(endpoints.club.addMember, memberData);

/**
 * Update an existing club member by member ID.
 * Endpoint: /club/member/update/{_id}
 * Method: PATCH (partial update)
 * Payload: partial ClubMember fields to update (e.g. { fullname, emailId, mobileNo, role, status }).
 * Requires: Authorization Bearer token.
 * Response: { success, data: ClubMember }
 */
export const updateClubMember = (memberId, updateData) =>
  axiosInstance.patch(endpoints.club.updateMember(memberId), updateData);

/**
 * Delete an existing club member by member ID.
 * Endpoint: /club/member/delete/{_id}
 * Method: DELETE
 * Requires: Authorization Bearer token.
 * Response: { success, message }
 */
export const deleteClubMember = (memberId) =>
  axiosInstance.delete(endpoints.club.deleteMember(memberId));
