import { all } from 'redux-saga/effects';
import categorySaga from './categories/categoriesSaga';
import authSaga from './auth/authSaga';


// Combine all sagas
export default function* rootSaga() {
  yield all([
    categorySaga(),
    authSaga(),

    // Add other sagas here
  ]);
}