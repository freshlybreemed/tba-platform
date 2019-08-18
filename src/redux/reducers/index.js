import { GET_USER } from "../constants/action-types";

const initialState = {
  user: {}
};
function rootReducer(state = initialState, action) {
  if (action.type === GET_USER) {
    state.user = action.payload;
  }
  return Object.assign({}, state);
}
export default rootReducer;