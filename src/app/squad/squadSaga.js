import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchClubs,
  createClub,
  updateClub,
  deleteClub,
  fetchClubDetails,
  fetchTeams,
  createTeam,
  addSquad,
  updateTeam,
  updateSquad,
  deleteTeam,
  fetchTeamDetails,
  addMember,
  removeMember,
  updateCaptain,
} from "./squadApi";
import {
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
  addMemberRequest,
  addMemberSuccess,
  addMemberFailure,
  removeMemberRequest,
  removeMemberSuccess,
  removeMemberFailure,
  updateCaptainRequest,
  updateCaptainSuccess,
  updateCaptainFailure,
} from "./squadSlice";

// ===== Clubs Sagas =====
function* handleFetchClubs({ payload }) {
  try {
    const response = yield call(fetchClubs, payload.userId);
    const clubs = response.data || response || [];
    yield put(fetchClubsSuccess(Array.isArray(clubs) ? clubs : []));
  } catch (error) {
    yield put(
      fetchClubsFailure(error.response?.data?.message || error.message || "Failed to fetch clubs.")
    );
  }
}

function* handleCreateClub({ payload }) {
  try {
    const response = yield call(createClub, payload);
    const club = response.data || response;
    if (!club || !club.id) {
      throw new Error('Invalid club data received');
    }
    yield put(createClubSuccess(club));
  } catch (error) {
    yield put(
      createClubFailure(error.response?.data?.message || error.message || "Failed to create club.")
    );
  }
}

function* handleUpdateClub({ payload }) {
  try {
    const { clubId, clubData } = payload;
    const response = yield call(updateClub, clubId, clubData);
    yield put(updateClubSuccess(response.data || response));
  } catch (error) {
    yield put(
      updateClubFailure(error.response?.data?.message || "Failed to update club.")
    );
  }
}

function* handleDeleteClub({ payload }) {
  try {
    yield call(deleteClub, payload);
    yield put(deleteClubSuccess(payload));
  } catch (error) {
    yield put(
      deleteClubFailure(error.response?.data?.message || "Failed to delete club.")
    );
  }
}

// ===== Teams Sagas =====
function* handleFetchTeams({ payload }) {
  try {
    const response = yield call(fetchTeams, payload.clubId);
    const teams = response.data || response || [];
    yield put(fetchTeamsSuccess(Array.isArray(teams) ? teams : []));
  } catch (error) {
    yield put(
      fetchTeamsFailure(error.response?.data?.message || error.message || "Failed to fetch teams.")
    );
  }
}

function* handleCreateTeam({ payload }) {
  try {
    console.log('📥 Saga received createTeamRequest with payload:', payload);

    if (!payload) {
      throw new Error('Create team payload is required');
    }
    const { clubId, teamData } = payload;
    if (!teamData || typeof teamData !== 'object') {
      throw new Error('Team data is required in payload');
    }

    console.log('📋 Calling squadApi.createTeam -> POST /team/add...');
    const response = yield call(createTeam, clubId ?? null, teamData);

    const raw = response?.data ?? response;
    const team = raw && typeof raw === 'object'
      ? { ...raw, id: raw.id ?? raw._id }
      : raw;
    if (!team || (team.id === undefined && team._id === undefined)) {
      console.error('❌ Invalid team data received:', response);
      throw new Error('Invalid team data received from API');
    }

    console.log('✅ Team created, dispatching success');
    yield put(createTeamSuccess(team));
  } catch (error) {
    console.error('❌ Error in handleCreateTeam:', error);
    const message = error.response?.data?.message ?? error.message ?? 'Failed to create team.';
    yield put(createTeamFailure(message));
  }
}

function* handleAddSquad({ payload }) {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Squad payload is required');
    }
    const response = yield call(addSquad, payload);
    const data = response?.data ?? response;
    yield put(addSquadSuccess(data));
  } catch (error) {
    const msg =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      'Failed to register squad.';
    yield put(addSquadFailure(msg));
  }
}

function* handleUpdateTeam({ payload }) {
  try {
    const { clubId, teamId, teamData } = payload;
    const response = yield call(updateTeam, clubId, teamId, teamData);
    const raw = response?.data ?? response;
    const team = raw && typeof raw === 'object'
      ? { ...raw, id: raw.id ?? raw._id }
      : raw;
    yield put(updateTeamSuccess(team));
  } catch (error) {
    yield put(
      updateTeamFailure(error.response?.data?.message || "Failed to update team.")
    );
  }
}

function* handleUpdateSquad({ payload }) {
  try {
    const { clubId, teamId, teamData } = payload;
    const response = yield call(updateSquad, clubId, teamId, teamData);
    const raw = response?.data ?? response;
    const team = raw && typeof raw === 'object'
      ? { ...raw, id: raw.id ?? raw._id }
      : raw;
    yield put(updateSquadSuccess(team));
  } catch (error) {
    yield put(
      updateSquadFailure(error.response?.data?.message || "Failed to update squad.")
    );
  }
}

function* handleDeleteTeam({ payload }) {
  try {
    const { clubId, teamId } = payload;
    yield call(deleteTeam, clubId, teamId);
    yield put(deleteTeamSuccess(teamId));
  } catch (error) {
    yield put(
      deleteTeamFailure(error.response?.data?.message || "Failed to delete team.")
    );
  }
}

// ===== Members Sagas =====
function* handleAddMember({ payload }) {
  try {
    const { clubId, teamId, memberData } = payload;
    const response = yield call(addMember, clubId, teamId, memberData);
    const member = response.data || response || memberData;
    yield put(addMemberSuccess({ teamId, member }));
    // Refresh teams to get updated data
    yield put(fetchTeamsRequest({ clubId }));
  } catch (error) {
    yield put(
      addMemberFailure(error.response?.data?.message || error.message || "Failed to add member.")
    );
  }
}

function* handleRemoveMember({ payload }) {
  try {
    const { clubId, teamId, memberId } = payload;
    yield call(removeMember, clubId, teamId, memberId);
    yield put(removeMemberSuccess({ teamId, memberId }));
    // Refresh teams to get updated data
    yield put(fetchTeamsRequest({ clubId }));
  } catch (error) {
    yield put(
      removeMemberFailure(error.response?.data?.message || error.message || "Failed to remove member.")
    );
  }
}

function* handleUpdateCaptain({ payload }) {
  try {
    const { clubId, teamId, captainId } = payload;
    yield call(updateCaptain, clubId, teamId, captainId);
    yield put(updateCaptainSuccess({ teamId, captainId }));
    // Refresh teams to get updated data
    yield put(fetchTeamsRequest({ clubId }));
  } catch (error) {
    yield put(
      updateCaptainFailure(error.response?.data?.message || error.message || "Failed to update captain.")
    );
  }
}

export default function* squadSaga() {
  yield takeLatest(fetchClubsRequest.type, handleFetchClubs);
  yield takeLatest(createClubRequest.type, handleCreateClub);
  yield takeLatest(updateClubRequest.type, handleUpdateClub);
  yield takeLatest(deleteClubRequest.type, handleDeleteClub);
  yield takeLatest(fetchTeamsRequest.type, handleFetchTeams);
  yield takeLatest(createTeamRequest.type, handleCreateTeam);
  yield takeLatest(addSquadRequest.type, handleAddSquad);
  yield takeLatest(updateTeamRequest.type, handleUpdateTeam);
  yield takeLatest(updateSquadRequest.type, handleUpdateSquad);
  yield takeLatest(deleteTeamRequest.type, handleDeleteTeam);
  yield takeLatest(addMemberRequest.type, handleAddMember);
  yield takeLatest(removeMemberRequest.type, handleRemoveMember);
  yield takeLatest(updateCaptainRequest.type, handleUpdateCaptain);
}
