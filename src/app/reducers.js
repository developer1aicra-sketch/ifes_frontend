import { combineReducers } from 'redux';
import categoryReducer from './categories/categoriesSlice';
import authReducer from './auth/authSlice';
import competitionReducer from './competition/competitionSlice';
import squadReducer from './squad/squadSlice';

const rootReducer = combineReducers({
  category: categoryReducer,
  auth: authReducer,
  competition: competitionReducer,
  squad: squadReducer,
  // Add other reducers here
});

export default rootReducer;