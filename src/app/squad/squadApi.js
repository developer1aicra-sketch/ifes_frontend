import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

// ===== Squad Add (full lineup registration) =====
// Required: club_id, teamName, captain_id. Result shape: { club_id, category, teamName, event_id, competition_id, bot_id, lineup: { captain_id, members }, entry_fee }
export const addSquad = async (payload) => {
  const club_id = String(payload.club_id ?? '').trim();
  const teamName = String(payload.teamName ?? '').trim();
  const captain_id = String(payload.lineup?.captain_id ?? '').trim();
  // const bot_id = String(payload.bot_id ?? '').trim();

  if (!club_id) throw new Error('club_id is required');
  if (!teamName) throw new Error('teamName is required');
  if (!captain_id) throw new Error('captain_id is required');
  // if (!bot_id) throw new Error('bot_id is required');

  const rawMembers = Array.isArray(payload.lineup?.members) ? payload.lineup.members : [];
  const members = rawMembers
    .map((m) => (m != null && typeof m === 'object' ? m._id ?? m.id : m))
    .filter((id) => id != null)
    .map((id) => String(id));

  const body = {
    club_id,
    category: String(payload.category ?? 'Senior'),
    teamName,
    event_id: String(payload.event_id ?? ''),
    competition_id: String(payload.competition_id ?? ''),
    // bot_id,
    lineup: {
      captain_id,
      members,
    },
    entry_fee: Number(payload.entry_fee) || 500,
  };
  const response = await axiosInstance.post(endpoints.squad.add, body, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};
import { getMyClubs, getClubById } from "../../api/clubApi";
import { createTeam as createTeamApi, getTeamList, updateTeam as updateTeamApi } from "../../api/teamApi";
import {
  getClubsFromStorage,
  saveClubToStorage,
  deleteClubFromStorage,
  getTeamsFromStorage,
  saveTeamToStorage,
  deleteTeamFromStorage,
  generateId,
} from "../../utils/squadStorage";

// Helper to check if API is available
const isApiAvailable = () => {
  // In development, you can set this to false to use localStorage
  // In production, this should always be true
  return process.env.NODE_ENV === 'production' || true; // Set to false to use localStorage
};

// ===== Clubs API =====
export const fetchClubs = async (userId) => {
  if (!isApiAvailable()) {
    // Fallback to localStorage
    const clubs = getClubsFromStorage(userId);
    return { data: clubs };
  }

  try {
    // First, get the list of clubs from /club/my/get
    const myClubsResponse = await getMyClubs();
    const clubsList = myClubsResponse?.data?.data ?? myClubsResponse?.data ?? [];
    
    if (!Array.isArray(clubsList) || clubsList.length === 0) {
      return { data: [] };
    }

    // Fetch detailed information for each club using /club/get/{_id}
    const clubsWithDetails = await Promise.all(
      clubsList.map(async (club) => {
        const clubId = club._id || club.id;
        if (!clubId) {
          // If no _id, return the club as-is
          return club;
        }

        try {
          // Fetch detailed club information
          const detailResponse = await getClubById(clubId);
          const detailedClub = detailResponse?.data?.data ?? detailResponse?.data ?? club;
          
          // Merge the original club data with detailed data
          // Ensure we preserve the _id and other important fields
          return {
            ...club,
            ...detailedClub,
            id: clubId, // Ensure id is set for compatibility
            _id: clubId, // Ensure _id is preserved
          };
        } catch (detailError) {
          // If fetching details fails, return the original club data
          console.warn(`Failed to fetch details for club ${clubId}:`, detailError);
          return {
            ...club,
            id: clubId,
            _id: clubId,
          };
        }
      })
    );

    return { data: clubsWithDetails };
  } catch (error) {
    // Fallback to localStorage if API fails
    console.warn('API failed, using localStorage fallback:', error);
    const clubs = getClubsFromStorage(userId);
    return { data: clubs };
  }
};

export const createClub = async (clubData) => {
  if (!isApiAvailable()) {
    // Fallback to localStorage
    const club = {
      ...clubData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      teamCount: 0,
      competitionCount: 0,
    };
    saveClubToStorage(club);
    return { data: club };
  }

  try {
    const response = await axiosInstance.post(endpoints.squad.clubs.create, clubData);
    return response.data;
  } catch (error) {
    // Fallback to localStorage if API fails
    console.warn('API failed, using localStorage fallback:', error);
    const club = {
      ...clubData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      teamCount: 0,
      competitionCount: 0,
    };
    saveClubToStorage(club);
    return { data: club };
  }
};

export const updateClub = async (clubId, clubData) => {
  if (!isApiAvailable()) {
    // Fallback to localStorage
    const club = { ...clubData, id: clubId };
    saveClubToStorage(club);
    return { data: club };
  }

  try {
    const response = await axiosInstance.put(
      endpoints.squad.clubs.update(clubId),
      clubData
    );
    return response.data;
  } catch (error) {
    // Fallback to localStorage if API fails
    console.warn('API failed, using localStorage fallback:', error);
    const club = { ...clubData, id: clubId };
    saveClubToStorage(club);
    return { data: club };
  }
};

export const deleteClub = async (clubId) => {
  if (!isApiAvailable()) {
    // Fallback to localStorage
    deleteClubFromStorage(clubId);
    return { data: { success: true } };
  }

  try {
    const response = await axiosInstance.delete(
      endpoints.squad.clubs.delete(clubId)
    );
    return response.data;
  } catch (error) {
    // Fallback to localStorage if API fails
    console.warn('API failed, using localStorage fallback:', error);
    deleteClubFromStorage(clubId);
    return { data: { success: true } };
  }
};

export const fetchClubDetails = async (clubId) => {
  const response = await axiosInstance.get(
    endpoints.squad.clubs.details(clubId)
  );
  return response.data;
};

// ===== Teams API =====
// Fetches teams via GET /team/list (optional club_id filter for squad manager)
export const fetchTeams = async (clubId) => {
  if (!isApiAvailable()) {
    const teams = getTeamsFromStorage(clubId);
    return { data: teams };
  }

  try {
    const params = clubId ? { club_id: clubId } : {};
    const response = await getTeamList(params);
    const raw = response?.data?.data ?? response?.data ?? response;
    const list = Array.isArray(raw) ? raw : [];
    // Normalize /team/list response for UI: id, name, clubId, captainId, captain (populated), status, createdAt, members
    const teams = list.map((t) => ({
      ...t,
      id: t.id ?? t._id,
      name: t.teamName ?? t.name,
      teamName: t.teamName ?? t.name,
      clubId: t.clubId ?? t.club_id ?? clubId ?? null,
      captainId: t.captain_id ?? t.captainId,
      captain: t.captain,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      createdBy: t.createdBy,
      members: t.members ?? [],
    }));
    return { data: teams };
  } catch (error) {
    console.warn('API failed, using localStorage fallback:', error);
    const teams = getTeamsFromStorage(clubId);
    return { data: teams };
  }
};

export const createTeam = async (clubId, teamData) => {
  if (!teamData || typeof teamData !== 'object') {
    throw new Error('Team data is required');
  }

  if (!isApiAvailable()) {
    // Fallback to localStorage
    const team = {
      name: teamData.teamName || teamData.name,
      id: generateId(),
      clubId: clubId || null,
      createdAt: new Date().toISOString(),
      members: teamData.members || [],
      captainId: teamData.captainId || null,
    };
    saveTeamToStorage(team);
    return { data: team };
  }

  try {
    // Full payload shape when teamData has lineup (same as squad/add)
    const hasFullShape =
      teamData.lineup &&
      typeof teamData.event_id !== 'undefined' &&
      typeof teamData.category !== 'undefined';

    const payload = hasFullShape
      ? {
          club_id: String((teamData.club_id || clubId) ?? ''),
          category: String(teamData.category ?? 'Senior'),
          teamName: String(teamData.teamName ?? teamData.name ?? ''),
          event_id: String(teamData.event_id ?? ''),
          competition_id: String(teamData.competition_id ?? ''),
          // Keep captain_id at top-level for compatibility with older validations.
          // Keep lineup.captain_id too because squad endpoints use lineup shape.
          captain_id: String(teamData.captain_id ?? teamData.lineup?.captain_id ?? ''),
          lineup: {
            // bot_id: String(teamData.lineup?.bot_id ?? ''),
            captain_id: String(teamData.lineup?.captain_id ?? teamData.captain_id ?? ''),
            members: Array.isArray(teamData.lineup?.members) ? teamData.lineup.members.map((m) => String(m)) : [],
          },
          entry_fee: Number(teamData.entry_fee) || 500,
        }
      : {
          teamName: teamData.teamName || teamData.name,
          club_id: teamData.club_id || clubId,
          captain_id: teamData.captain_id,
          ...(teamData.competition_id != null && teamData.competition_id !== '' && { competition_id: teamData.competition_id }),
        };

    const teamNameVal = (payload.teamName && String(payload.teamName).trim()) || '';
    const clubIdVal = (payload.club_id && String(payload.club_id).trim()) || '';
    const captainIdVal = (payload.captain_id ?? (payload.lineup && payload.lineup.captain_id));
    const captainIdStr = (captainIdVal && String(captainIdVal).trim()) || '';

    if (!teamNameVal) throw new Error('teamName is required');
    if (!clubIdVal) throw new Error('club_id is required');
    if (!captainIdStr) throw new Error('captain_id is required');

    console.log('📤 Calling POST /squad/add with payload:', payload);
    const response = await createTeamApi(payload);
    const raw = response?.data?.data ?? response?.data ?? response;

    // Normalize backend response: ensure id for Redux (backend may return _id only)
    const team = raw && typeof raw === 'object'
      ? { ...raw, id: raw.id ?? raw._id }
      : raw;
    console.log('✅ Team created successfully:', team);
    return { data: team };
  } catch (error) {
    console.warn('API failed, using localStorage fallback:', error);
    const team = {
      name: teamData.teamName || teamData.name,
      id: generateId(),
      clubId: clubId || null,
      createdAt: new Date().toISOString(),
      members: teamData.members || [],
      captainId: teamData.captainId || null,
    };
    saveTeamToStorage(team);
    return { data: team };
  }
};

export const updateTeam = async (clubId, teamId, teamData) => {
  if (!isApiAvailable()) {
    const team = { ...teamData, id: teamId, clubId };
    saveTeamToStorage(team);
    return { data: team };
  }

  try {
    // Payload for PUT /team/update/{_id}: only fields being updated (no club_id, captain_id, competition_id)
    const payload = {};
    const name = teamData.teamName ?? teamData.name;
    if (name != null && name !== '') {
      payload.teamName = name;
    }
    if (teamData.description != null && teamData.description !== '') {
      payload.description = teamData.description;
    }

    const response = await updateTeamApi(teamId, payload);
    const raw = response?.data?.data ?? response?.data ?? response;
    const team = raw && typeof raw === 'object'
      ? { ...raw, id: raw.id ?? raw._id }
      : raw;
    return { data: team };
  } catch (error) {
    console.warn('API failed, using localStorage fallback:', error);
    const team = { ...teamData, id: teamId, clubId };
    saveTeamToStorage(team);
    return { data: team };
  }
};

export const deleteTeam = async (clubId, teamId) => {
  if (!isApiAvailable()) {
    // Fallback to localStorage
    deleteTeamFromStorage(teamId);
    return { data: { success: true } };
  }

  try {
    const response = await axiosInstance.delete(
      endpoints.squad.teams.delete(clubId, teamId)
    );
    return response.data;
  } catch (error) {
    // Fallback to localStorage if API fails
    console.warn('API failed, using localStorage fallback:', error);
    deleteTeamFromStorage(teamId);
    return { data: { success: true } };
  }
};

export const fetchTeamDetails = async (clubId, teamId) => {
  const response = await axiosInstance.get(
    endpoints.squad.teams.details(clubId, teamId)
  );
  return response.data;
};

// ===== Update Squad (PATCH /squad/update/{_id}) =====
// Uses squad _id (teamId in UI). Same payload shape as add; backend updates by _id.
export const updateSquad = async (clubId, teamId, payload) => {
  const squadId = String(teamId ?? payload._id ?? payload.id ?? '').trim();
  if (!squadId) throw new Error('Squad _id is required for update');

  const club_id = String(payload.club_id ?? payload.clubId ?? clubId ?? '').trim();
  const teamName = String(payload.teamName ?? payload.name ?? '').trim();
  const captain_id = String(payload.lineup?.captain_id ?? payload.captain_id ?? '').trim();
  const bot_id = String(payload.bot_id ?? '').trim();
  const rawMembers = Array.isArray(payload.lineup?.members) ? payload.lineup.members : [];
  const members = rawMembers
    .map((m) => (m != null && typeof m === 'object' ? m._id ?? m.id : m))
    .filter((id) => id != null)
    .map((id) => String(id));

  const body = {
    club_id: club_id || String(clubId),
    category: String(payload.category ?? 'Senior'),
    teamName,
    event_id: String(payload.event_id ?? ''),
    competition_id: String(payload.competition_id ?? ''),
    bot_id,
    lineup: {
      captain_id,
      members,
    },
    entry_fee: Number(payload.entry_fee) || 500,
  };

  const response = await axiosInstance.patch(
    endpoints.squad.update(squadId),
    body
  );
  const raw = response?.data?.data ?? response?.data ?? response;
  const team = raw && typeof raw === 'object' ? { ...raw, id: raw.id ?? raw._id } : raw;
  return { data: team };
};

// ===== Members API =====
export const addMember = async (clubId, teamId, memberData) => {
  if (!isApiAvailable()) {
    // Fallback to localStorage
    const teams = getTeamsFromStorage(clubId);
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.members = [...(team.members || []), memberData];
      saveTeamToStorage(team);
      return { data: memberData };
    }
    throw new Error('Team not found');
  }

  try {
    const response = await axiosInstance.post(
      endpoints.squad.members.add(clubId, teamId),
      memberData
    );
    return response.data;
  } catch (error) {
    // Fallback to localStorage if API fails
    console.warn('API failed, using localStorage fallback:', error);
    const teams = getTeamsFromStorage(clubId);
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.members = [...(team.members || []), memberData];
      saveTeamToStorage(team);
      return { data: memberData };
    }
    throw error;
  }
};

export const removeMember = async (clubId, teamId, memberId) => {
  if (!isApiAvailable()) {
    // Fallback to localStorage
    const teams = getTeamsFromStorage(clubId);
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.members = (team.members || []).filter(m => m.id !== memberId);
      if (team.captainId === memberId) {
        team.captainId = null;
      }
      saveTeamToStorage(team);
      return { data: { success: true } };
    }
    throw new Error('Team not found');
  }

  try {
    const response = await axiosInstance.delete(
      endpoints.squad.members.remove(clubId, teamId, memberId)
    );
    return response.data;
  } catch (error) {
    // Fallback to localStorage if API fails
    console.warn('API failed, using localStorage fallback:', error);
    const teams = getTeamsFromStorage(clubId);
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.members = (team.members || []).filter(m => m.id !== memberId);
      if (team.captainId === memberId) {
        team.captainId = null;
      }
      saveTeamToStorage(team);
      return { data: { success: true } };
    }
    throw error;
  }
};

export const updateCaptain = async (clubId, teamId, captainId) => {
  if (!isApiAvailable()) {
    // Fallback to localStorage
    const teams = getTeamsFromStorage(clubId);
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.captainId = captainId;
      saveTeamToStorage(team);
      return { data: { captainId } };
    }
    throw new Error('Team not found');
  }

  try {
    const response = await axiosInstance.put(
      endpoints.squad.members.updateCaptain(clubId, teamId),
      { captainId }
    );
    return response.data;
  } catch (error) {
    // Fallback to localStorage if API fails
    console.warn('API failed, using localStorage fallback:', error);
    const teams = getTeamsFromStorage(clubId);
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.captainId = captainId;
      saveTeamToStorage(team);
      return { data: { captainId } };
    }
    throw error;
  }
};
