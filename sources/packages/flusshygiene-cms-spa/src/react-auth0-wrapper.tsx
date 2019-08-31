import React, { useState, useEffect, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import { APIMountPoints, ApiResources } from './lib/common/enums';
import { IFetchOptions, IFetchHeaders } from './lib/common/interfaces';
import { handleErrors } from './lib/state/reducers/actions/fetch-common';
import { REACT_APP_API_HOST } from './lib/config';

const DEFAULT_REDIRECT_CALLBACK = (appState?: any) =>
  window.history.replaceState({}, document.title, window.location.pathname);
type ContextProps = {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  popupOpen: any;
  loginWithPopup: any;
  handleRedirectCallback: any;
  getIdTokenClaims: any;
  loginWithRedirect: any;
  getTokenSilently: any;
  getTokenWithPopup: any;
  logout: any;
};

export const Auth0Context = React.createContext<Partial<ContextProps>>({});
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(
        initOptions as Auth0ClientOptions,
      );
      setAuth0(auth0FromHook);

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (isAuthenticated === false) {
      return;
    }
    if (!auth0Client) {
      return;
    }
    if (!user) {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;
    const getUserId = async () => {
      const token = await auth0Client.getTokenSilently();
      const headers: IFetchHeaders = {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const opts: IFetchOptions = {
        method: 'GET',
        headers: headers,
        signal: signal,
      };
      fetch(
        `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}?auth0Id=${user.sub}`,
        opts,
      )
        .then(handleErrors)
        .then((res) => res.json())
        .then((json) => {
          // console.log(json);
          if (user.sub === json.data[0].auth0Id) {
            user.pgapiData = json.data[0];
            setUser(user);
            // console.log(user);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getUserId();
    return function cleanup() {
      abortController.abort();
    };
  }, [auth0Client, isAuthenticated, user]);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
