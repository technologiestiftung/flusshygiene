import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from './lib/auth/react-auth0-wrapper';
// import { Auth0Provider } from './react-auth0-wrapper-offline';

import ErrorBoundary from './components/ErrorBoundary';
import {
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_CLIENTID,
  REACT_APP_AUTH0_AUDIENCE,
} from './lib/config';
import { OcpuProvider } from './contexts/opencpu';
import { EventSourceProvider } from './contexts/eventsource';
import { ApiProvider } from './contexts/postgres-api';
// import { Provider } from 'react-redux';
// import store from './lib/state/store';
// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: any) => {
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
    {/* <Provider store={store}> */}
    <Auth0Provider
      domain={REACT_APP_AUTH0_DOMAIN}
      client_id={REACT_APP_AUTH0_CLIENTID}
      redirect_uri={window.location.origin}
      audience={REACT_APP_AUTH0_AUDIENCE}
      onRedirectCallback={onRedirectCallback}
    >
      <ApiProvider>
        <OcpuProvider>
          <EventSourceProvider>
            <App />
          </EventSourceProvider>
        </OcpuProvider>
      </ApiProvider>
    </Auth0Provider>
    {/* </Provider> */}
  </ErrorBoundary>,
  document.getElementById('root'),
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (process.env.NODE_ENV === 'production') {
  serviceWorker.unregister();
}
