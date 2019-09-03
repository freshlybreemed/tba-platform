import { applyMiddleware, createStore } from "redux";
import { createLogger } from 'redux-logger'
import rootReducer from "../reducers/index";

const logger = createLogger({
    // ...options
  });
const store = createStore(rootReducer, applyMiddleware(logger));
export default store;