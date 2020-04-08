import React from "react";
import { Auth0Context } from "../lib/auth/react-auth0-wrapper";
import { HelpDeskStateContext } from "./helpdesk";

export const CombinedContext = React.createContext({});

export const ProvideCombindeContext = (props) => {
  return (
    <Auth0Context.Consumer>
      {(authContext) => (
        <HelpDeskStateContext.Consumer>
          {(helpDeskContext) => (
            <CombinedContext.Provider value={{ authContext, helpDeskContext }}>
              {props.children}
            </CombinedContext.Provider>
          )}
        </HelpDeskStateContext.Consumer>
      )}
    </Auth0Context.Consumer>
  );
};
