import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
// Logger with default options
import logger from 'redux-logger'

import reducers from "./reducers";

const reduxDevtools =
  typeof window !== "undefined" && process.env.NODE_ENV !== "production"
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f;

const enhancers = compose(
  applyMiddleware(thunk),
  applyMiddleware(logger),
  reduxDevtools
);

export const makeStore = initialState => {
  return createStore(reducers, initialState, enhancers);
};