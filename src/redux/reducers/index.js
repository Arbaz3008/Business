// src/redux/reducers/index.js

import { combineReducers } from 'redux';
import authReducer from './authReducer';
import projectReducer from './projectReducer';
import teamReducer from './teamReducer';
import customerReducer from './customerReducer';
import salesReducer from './salesReducer';
//mport messageReducer from './messageReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectReducer,
  team: teamReducer,
  customers: customerReducer,
  sales: salesReducer,
  customers: customerReducer,
  team: teamReducer,
 
});

export default rootReducer;



