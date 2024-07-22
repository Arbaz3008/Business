
import { combineReducers } from 'redux';
import { SET_TEAM, ADD_MESSAGE } from '../actions/action';

const teamReducer = (state = [], action) => {
  switch (action.type) {
    case SET_TEAM:
      return action.payload;
    default:
      return state;
  }
};

const chatMessagesReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  team: teamReducer,
  chatMessages: chatMessagesReducer,
});

export default rootReducer;
