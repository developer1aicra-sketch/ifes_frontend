import { all } from 'redux-saga/effects';
import categorySaga from './categories/categoriesSaga';
import authSaga from './auth/authSaga';
import competitionSaga from './competition/competitionSaga';
import squadSaga from './squad/squadSaga';


// Combine all sagas
export default function* rootSaga() {
  yield all([
    categorySaga(),
    authSaga(),
    competitionSaga(),
    squadSaga(),

    // Add other sagas here
  ]);
}