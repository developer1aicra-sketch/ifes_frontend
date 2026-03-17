import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchCompetition, fetchCompetitions } from './competitionApi';
import {
  fetchCompetitionsFailure,
  fetchCompetitionsRequest,
  fetchCompetitionsSuccess,
  fetchCompetitionFailure,
  fetchCompetitionRequest,
  fetchCompetitionSuccess,
} from './competitionSlice';

function* handleFetchCompetitions() {
  try {
    const response = yield call(fetchCompetitions);
    const raw = response?.data ?? response;
    const list = raw?.data ?? raw;
    yield put(fetchCompetitionsSuccess(Array.isArray(list) ? list : []));
  } catch (error) {
    const msg =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      'Failed to fetch competitions.';
    yield put(fetchCompetitionsFailure(msg));
  }
}

function* handleFetchCompetition({ payload }) {
  try {
    const response = yield call(fetchCompetition, payload);
    const raw = response?.data ?? response;
    const single = raw?.data ?? raw;
    yield put(fetchCompetitionSuccess(single ?? null));
  } catch (error) {
    const msg =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      'Failed to fetch competition.';
    yield put(fetchCompetitionFailure(msg));
  }
}

export default function* competitionSaga() {
  yield takeLatest(fetchCompetitionsRequest.type, handleFetchCompetitions);
  yield takeLatest(fetchCompetitionRequest.type, handleFetchCompetition);
}

