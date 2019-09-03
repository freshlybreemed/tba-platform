import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/stable';
// import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { addUser } from "./redux/actions/index";
import rootReducer from './redux/reducers';
import './index.css';
import store from "./redux/store";

import App from './App';
import { Auth0Provider } from "./react-auth0-wrapper";
import * as serviceWorker from './serviceWorker';


window.store = store;
// console.log(window.store.getState())
store.subscribe(() => {
  console.log('Look ma, Redux!!')
  console.log(window.store.getState())
})
// window.store.dispatch( addUser({ title: 'React Redux Tutorial for Beginners', id: 1 }) )
// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
    window.history.replaceState(
      {},
      document.title,
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  };

ReactDOM.render( 
  <Provider store={window.store}>
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={"https://tbaevents.auth0.com/api/v2/"}
      prompt="none"
    >
      <App />
    </Auth0Provider>
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
