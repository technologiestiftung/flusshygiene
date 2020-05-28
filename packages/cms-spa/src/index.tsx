import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import "abortcontroller-polyfill/dist/polyfill-patch-fetch";
import "fast-text-encoding"; // TODO: to fix https://github.com/auth0/auth0-spa-js/issues/316
import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./lib/auth/react-auth0-wrapper";
// import { Auth0Provider } from './react-auth0-wrapper-offline';

import { WrapErrorBoundary } from "./components/ErrorBoundary";
import {
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_CLIENTID,
  REACT_APP_AUTH0_AUDIENCE,
} from "./lib/config";
import { OcpuProvider } from "./contexts/opencpu";
import { EventSourceProvider } from "./contexts/eventsource";
import { ApiProvider } from "./contexts/postgres-api";
import { HelpDeskProvider } from "./contexts/helpdesk";
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
  // <ErrorBoundary>
  <Auth0Provider
    domain={REACT_APP_AUTH0_DOMAIN}
    client_id={REACT_APP_AUTH0_CLIENTID}
    redirect_uri={window.location.origin}
    audience={REACT_APP_AUTH0_AUDIENCE}
    onRedirectCallback={onRedirectCallback}
  >
    <HelpDeskProvider>
      <WrapErrorBoundary>
        {/* <ErrorBoundary> */}
        {/* <MessageProvider> */}
        <ApiProvider>
          <OcpuProvider>
            <EventSourceProvider>
              <App />
            </EventSourceProvider>
          </OcpuProvider>
        </ApiProvider>
        {/* </ErrorBoundary> */}
        {/* </MessageProvider> */}
      </WrapErrorBoundary>
    </HelpDeskProvider>
  </Auth0Provider>,

  // </ErrorBoundary>,
  document.getElementById("root"),
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (process.env.NODE_ENV === "production") {
  serviceWorker.unregister();
}
