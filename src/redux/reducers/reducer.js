import { SET_MESSAGES, ADD_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } from '../actions/action';

const initialState = {
  messages: [],
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(message => message.id !== action.payload),
      };
    case UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.id ? { ...message, text: action.payload.text } : message
        ),
      };
    default:
      return state;
  }
};

export default messageReducer;
