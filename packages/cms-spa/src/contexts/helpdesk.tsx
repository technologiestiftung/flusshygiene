import React from "react";
import { IBathingspot } from "../lib/common/interfaces";
interface HelpDeskState {
  spot?: IBathingspot;
}
type HelpDeskProviderProps = { children: React.ReactNode };

interface HelpDeskAction {
  type: "SET_SPOT";
  payload: IBathingspot;
}

type HelpDeskDispatch = (action: HelpDeskAction) => void;

export const HelpDeskStateContext = React.createContext<
  HelpDeskState | undefined
>(undefined);

const HelpDeskDispatchContext = React.createContext<
  HelpDeskDispatch | undefined
>(undefined);

const helpDeskReducer: (
  state: HelpDeskState,
  action: HelpDeskAction,
) => HelpDeskState = (state, action) => {
  switch (action.type) {
    case "SET_SPOT": {
      // console.log("SET_SPOT", action.payload);

      return { ...state, spot: action.payload };
    }
    default: {
      throw new Error("No default state defined for helpdesk reducer");
    }
  }
};

const HelpDeskProvider = ({ children }: HelpDeskProviderProps) => {
  const [state, dispatch] = React.useReducer(helpDeskReducer, {});
  return (
    <HelpDeskStateContext.Provider value={state}>
      <HelpDeskDispatchContext.Provider value={dispatch}>
        {children}
      </HelpDeskDispatchContext.Provider>
    </HelpDeskStateContext.Provider>
  );
};

const useHelpDeskState = () => {
  const stateContext = React.useContext(HelpDeskStateContext);
  if (stateContext === undefined) {
    throw new Error("useHelpDeskState must be used within a HelpDeskProvider");
  }
  return stateContext;
};

const useHelpDeskDispatch = () => {
  const dispatchContext = React.useContext(HelpDeskDispatchContext);
  if (dispatchContext === undefined) {
    throw new Error(
      "useHelpDeskDispatch must be used within a HelpDeskProvider",
    );
  }
  return dispatchContext;
};

const useHelpDesk: () => [HelpDeskState, HelpDeskDispatch] = () => {
  return [useHelpDeskState(), useHelpDeskDispatch()];
};

export { HelpDeskProvider, useHelpDesk };
