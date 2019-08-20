import { GET_USER, GET_EVENTS } from "../constants/action-types";

const initialState = {
  user: {},
  events: []
};
function rootReducer(state = initialState, action) {
  if (action.type === GET_USER) {
    state.user = action.payload;
  }
  if (action.type === GET_EVENTS) {
    state.events = action.payload;
  }
  return Object.assign({}, state);
}
export default rootReducer;