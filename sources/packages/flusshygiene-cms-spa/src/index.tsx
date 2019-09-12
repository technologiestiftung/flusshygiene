import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from './react-auth0-wrapper';
// import { BannerProvider } from './contexts/banner';
// import { Auth0Provider } from './react-auth0-wrapper-offline';

// import config from './auth_config.json';
import { Provider } from 'react-redux';
import store from './lib/state/store';
import ErrorBoundary from './components/ErrorBoundary';
import {
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_CLIENTID,
  REACT_APP_AUTH0_AUDIENCE,
} from './lib/config';
// import Toggle from './components/Toggle';
// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

ReactDOM.render(
  <ErrorBoundary>
    {/* <BannerProvider> */}
    <Provider store={store}>
      <Auth0Provider
        domain={REACT_APP_AUTH0_DOMAIN}
        client_id={REACT_APP_AUTH0_CLIENTID}
        redirect_uri={window.location.origin}
        audience={REACT_APP_AUTH0_AUDIENCE}
        onRedirectCallback={onRedirectCallback}
      >
        <App />
      </Auth0Provider>
    </Provider>
    {/* </BannerProvider> */}
  </ErrorBoundary>,
  document.getElementById('root'),
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
