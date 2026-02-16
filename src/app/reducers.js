import { combineReducers } from 'redux';
import categoryReducer from './categories/categoriesSlice';
import authReducer from './auth/authSlice';

const rootReducer = combineReducers({
  category: categoryReducer,
  auth: authReducer,
  // Add other reducers here
});

export default rootReducer;