import { createSlice } from "@reduxjs/toolkit";

const squadSlice = createSlice({
  name: "squad",
  initialState: {
    clubs: [],
    selectedClub: null,
    activeClubId: null, // Club owner can "play" for only one club; this is that club's id. Others are manage-only.
    teams: [],
    selectedTeam: null,
    loading: 0, // 0 = idle, 1 = loading, 2 = completed
    error: null,
    success: null, // Success message
  },
  reducers: {
    // Clear error and success messages
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    // ===== Clubs =====
    fetchClubsRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    fetchClubsSuccess: (state, action) => {
      state.loading = 2;
      state.clubs = action.payload;
    },
    fetchClubsFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    createClubRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    createClubSuccess: (state, action) => {
      state.loading = 2;
      state.clubs = [...state.clubs, action.payload];
      state.error = null;
      state.success = 'Club created successfully!';
    },
    createClubFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    updateClubRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    updateClubSuccess: (state, action) => {
      state.loading = 2;
      state.clubs = state.clubs.map(club =>
        club.id === action.payload.id ? action.payload : club
      );
      if (state.selectedClub?.id === action.payload.id) {
        state.selectedClub = action.payload;
      }
      state.error = null;
      state.success = 'Club updated successfully!';
    },
    updateClubFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    deleteClubRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    deleteClubSuccess: (state, action) => {
      state.loading = 2;
      state.clubs = state.clubs.filter(club => club.id !== action.payload);
      if (state.selectedClub?.id === action.payload) {
        state.selectedClub = null;
      }
      if (state.activeClubId === action.payload) {
        state.activeClubId = null;
      }
      state.error = null;
      state.success = 'Club deleted successfully!';
    },
    deleteClubFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    setSelectedClub: (state, action) => {
      state.selectedClub = action.payload;
    },

    // Owner can play for only one club; others are manage-only. Toggle active/inactive.
    setActiveClub: (state, action) => {
      state.activeClubId = action.payload; // club id or null
    },

    // ===== Teams =====
    fetchTeamsRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    fetchTeamsSuccess: (state, action) => {
      state.loading = 2;
      state.teams = action.payload;
    },
    fetchTeamsFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    createTeamRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    createTeamSuccess: (state, action) => {
      state.loading = 2;
      state.teams = [...state.teams, action.payload];
      state.error = null;
      state.success = 'Team created successfully!';
    },
    createTeamFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    addSquadRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    addSquadSuccess: (state, action) => {
      state.loading = 2;
      state.error = null;
      state.success = action.payload?.message ?? 'Squad registered successfully!';
    },
    addSquadFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    updateTeamRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    updateTeamSuccess: (state, action) => {
      state.loading = 2;
      state.teams = state.teams.map(team =>
        team.id === action.payload.id ? action.payload : team
      );
      if (state.selectedTeam?.id === action.payload.id) {
        state.selectedTeam = action.payload;
      }
      state.error = null;
      state.success = 'Team updated successfully!';
    },
    updateTeamFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    updateSquadRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    updateSquadSuccess: (state, action) => {
      state.loading = 2;
      state.teams = state.teams.map(team =>
        team.id === action.payload.id ? action.payload : team
      );
      if (state.selectedTeam?.id === action.payload.id) {
        state.selectedTeam = action.payload;
      }
      state.error = null;
      state.success = 'Squad updated successfully!';
    },
    updateSquadFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    deleteTeamRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    deleteTeamSuccess: (state, action) => {
      state.loading = 2;
      state.teams = state.teams.filter(team => team.id !== action.payload);
      if (state.selectedTeam?.id === action.payload) {
        state.selectedTeam = null;
      }
      state.error = null;
      state.success = 'Team deleted successfully!';
    },
    deleteTeamFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload;
    },

    // ===== Team Members =====
    addMemberRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    addMemberSuccess: (state, action) => {
      state.loading = 2;
      const { teamId, member } = action.payload;
      state.teams = state.teams.map(team =>
        team.id === teamId
          ? { ...team, members: [...(team.members || []), member] }
          : team
      );
      if (state.selectedTeam?.id === teamId) {
        state.selectedTeam = {
          ...state.selectedTeam,
          members: [...(state.selectedTeam.members || []), member]
        };
      }
      state.error = null;
      state.success = 'Member added successfully!';
    },
    addMemberFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    removeMemberRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    removeMemberSuccess: (state, action) => {
      state.loading = 2;
      const { teamId, memberId } = action.payload;
      state.teams = state.teams.map(team =>
        team.id === teamId
          ? { ...team, members: (team.members || []).filter(m => m.id !== memberId) }
          : team
      );
      if (state.selectedTeam?.id === teamId) {
        state.selectedTeam = {
          ...state.selectedTeam,
          members: (state.selectedTeam.members || []).filter(m => m.id !== memberId)
        };
      }
      state.error = null;
      state.success = 'Member removed successfully!';
    },
    removeMemberFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },

    updateCaptainRequest: (state) => {
      state.loading = 1;
      state.error = null;
    },
    updateCaptainSuccess: (state, action) => {
      state.loading = 2;
      const { teamId, captainId } = action.payload;
      state.teams = state.teams.map(team =>
        team.id === teamId ? { ...team, captainId } : team
      );
      if (state.selectedTeam?.id === teamId) {
        state.selectedTeam = { ...state.selectedTeam, captainId };
      }
      state.error = null;
      state.success = 'Captain updated successfully!';
    },
    updateCaptainFailure: (state, action) => {
      state.loading = 2;
      state.error = action.payload;
    },
  },
});

export const {
  clearMessages,
  fetchClubsRequest,
  fetchClubsSuccess,
  fetchClubsFailure,
  createClubRequest,
  createClubSuccess,
  createClubFailure,
  updateClubRequest,
  updateClubSuccess,
  updateClubFailure,
  deleteClubRequest,
  deleteClubSuccess,
  deleteClubFailure,
  setSelectedClub,
  setActiveClub,
  fetchTeamsRequest,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  createTeamRequest,
  createTeamSuccess,
  createTeamFailure,
  addSquadRequest,
  addSquadSuccess,
  addSquadFailure,
  updateTeamRequest,
  updateTeamSuccess,
  updateTeamFailure,
  updateSquadRequest,
  updateSquadSuccess,
  updateSquadFailure,
  deleteTeamRequest,
  deleteTeamSuccess,
  deleteTeamFailure,
  setSelectedTeam,
  addMemberRequest,
  addMemberSuccess,
  addMemberFailure,
  removeMemberRequest,
  removeMemberSuccess,
  removeMemberFailure,
  updateCaptainRequest,
  updateCaptainSuccess,
  updateCaptainFailure,
} = squadSlice.actions;

export default squadSlice.reducer;

// ===== Selectors =====
const selectSquadSlice = (state) => state?.squad;

export const selectClubs = (state) => selectSquadSlice(state)?.clubs ?? [];
export const selectSelectedClub = (state) => selectSquadSlice(state)?.selectedClub ?? null;
export const selectActiveClubId = (state) => selectSquadSlice(state)?.activeClubId ?? null;
export const selectTeams = (state) => selectSquadSlice(state)?.teams ?? [];
export const selectSelectedTeam = (state) => selectSquadSlice(state)?.selectedTeam ?? null;
export const selectSquadLoading = (state) => selectSquadSlice(state)?.loading ?? 0;
export const selectSquadError = (state) => selectSquadSlice(state)?.error ?? null;
export const selectSquadSuccess = (state) => selectSquadSlice(state)?.success ?? null;
export const selectIsSquadLoading = (state) => (selectSquadSlice(state)?.loading ?? 0) === 1;
export const selectHasSquadLoaded = (state) =>
  (selectSquadSlice(state)?.loading ?? 0) === 2 && !selectSquadSlice(state)?.error;

