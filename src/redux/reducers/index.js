import { GET_USER, GET_EVENTS, GET_EVENT } from "../constants/action-types";

const initialState = {
  user: {},
  events: [],
  event: {}
};
function rootReducer(state = initialState, action) {
  if (action.type === GET_USER) {
    state.user = action.payload;
  }
  if (action.type === GET_EVENTS) {
    state.events = action.payload;
  }
  if (action.type === GET_EVENT) {
    state.event = action.payload;
  }
  return Object.assign({}, state);
}
export default rootReducer;