// ┌┬┐┌─┐┌─┐┬┌─
// ││││ ││  ├┴┐
// ┴ ┴└─┘└─┘┴ ┴
import React, { useContext } from 'react';

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

const DEFAULT_REDIRECT_CALLBACK = (appState?: any) =>
  window.history.replaceState({}, document.title, window.location.pathname);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initProps
}) => {
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated: true,
        user: { pgapiData: { id: 3 } },
        loading: false,
        popupOpen: false,
        loginWithPopup: false,
        handleRedirectCallback: () => {
          console.log('handleRedirectCallback');
        },
        getIdTokenClaims: () => {
          console.log('getIdTokenClaims');
        },
        loginWithRedirect: () => {
          console.log('loginWithRedirect');
        },
        getTokenSilently: () => {
          console.log('getTokenSilently');
        },
        getTokenWithPopup: () => {
          console.log('getTokenWithPopup');
        },
        logout: () => {
          console.log('logout');
        },
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
