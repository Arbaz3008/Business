import { FETCH_PROJECTS_SUCCESS, FETCH_PROJECTS_FAILURE } from '../actions/projectActions';

const initialState = {
  projects: [],
  error: null,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.payload,
        error: null,
      };
    case FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default projectReducer;
