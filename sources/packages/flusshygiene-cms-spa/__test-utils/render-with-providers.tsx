import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
// import config from '../src/auth_config.json';

import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Auth0Provider } from '../src/react-auth0-wrapper';
import { onRedirectCallback } from '../src/lib/auth/on-redirect-callback';
import { createStore } from 'redux';
import { reducer } from './empty-reducer';
import { initialState } from './initial-state';

jest.mock('../src/react-auth0-wrapper');
function render(ui: any, store?: any, history?: any, ...rest: any[]) {
  if (!store) {
    store = createStore(reducer, initialState);
  }
  if (!history) {
    history = createMemoryHistory();
  }
  return rtlRender(
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      client_id={process.env.REACT_APP_AUTH0_CLIENTID}
      redirect_uri={window.location.origin}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      onRedirectCallback={onRedirectCallback}
    >
      <Provider store={store}>
        <Router history={history}>{ui}</Router>
      </Provider>
    </Auth0Provider>,
    ...rest,
  );
}

export * from '@testing-library/react';
export { render };
