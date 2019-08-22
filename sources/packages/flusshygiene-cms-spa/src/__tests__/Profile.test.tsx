import React from 'react';
import { createStore } from 'redux';
import { reducer } from '../../__test-utils/empty-reducer';
import { initialState } from '../../__test-utils/initial-state';
import { render } from '../../__test-utils/render-with-providers';
import { createMemoryHistory } from 'history';
import Profile from '../components/Profile';
import { Auth0Provider } from '../react-auth0-wrapper';
// import config from '../auth_config.json';

// jest.mock('../react-auth0-wrapper.tsx', ()=>{
//   Auth0Provider: jest.fn(()=>{
//     const Auth0ContextMock = React.createContext<Partial<{}>>({});
//     return ();
//   })
// })
it.skip('renders Home without crashing', () => {
  const store = createStore(reducer, initialState);
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const onRedirectCallback = (appState) => {
    window.history.replaceState(
      {},
      document.title,
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  };
  render(
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      client_id={process.env.REACT_APP_CLIENTID}
      redirect_uri={window.location.origin}
      audience={process.env.REACT_APP_AUDIENCE}
      onRedirectCallback={onRedirectCallback}
    >
      <Profile />
    </Auth0Provider>,
    store,
    history,
  );
});
