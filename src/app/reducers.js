import { combineReducers } from 'redux';
import categoryReducer from './categories/categoriesSlice';
import authReducer from './auth/authSlice';
import competitionReducer from './competition/competitionSlice';
import squadReducer from './squad/squadSlice';
import uiReducer from './ui/uiSlice';

const rootReducer = combineReducers({
  category: categoryReducer,
  auth: authReducer,
  competition: competitionReducer,
  squad: squadReducer,
  ui: uiReducer,
  // Add other reducers here
});

export default rootReducer;