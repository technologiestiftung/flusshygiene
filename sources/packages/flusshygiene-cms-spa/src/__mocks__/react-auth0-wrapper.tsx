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
        handleRedirectCallback: jest.fn(),
        getIdTokenClaims: jest.fn(),
        loginWithRedirect: jest.fn(),
        getTokenSilently: jest.fn(),
        getTokenWithPopup: jest.fn(),
        logout: jest.fn(),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
