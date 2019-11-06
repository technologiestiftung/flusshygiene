import React, { createContext, useContext, useReducer } from 'react';
type WSDispatchTypes = 'MESSAGE_RECEIVED';

interface IWSAction {
  type: WSDispatchTypes;
  payload: {
    sessionId: string;
    message: string;
  };
}

interface IWSState {
  sessionId?: string;
  messages: string[];
}
type Dispatch = (action: IWSAction) => void;
type WSProviderProps = { children: React.ReactNode };
const WSStateContext = createContext<IWSState | undefined>(undefined);
const WSDispatchContext = createContext<Dispatch | undefined>(undefined);

const wsReducer: (state: IWSState, action: IWSAction) => IWSState = (
  state,
  action,
) => {
  switch (action.type) {
    case 'MESSAGE_RECEIVED': {
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const WSProvider = ({ children }: WSProviderProps) => {
  const initalState: IWSState = {
    sessionId: undefined,
    messages: [],
  };
  const [state, dispatch] = useReducer(wsReducer, initalState);
  return (
    <WSStateContext.Provider value={state}>
      <WSDispatchContext.Provider value={dispatch}>
        {children}
      </WSDispatchContext.Provider>
    </WSStateContext.Provider>
  );
};

const useWSState = () => {
  const stateContext = useContext(WSStateContext);
  if (stateContext === undefined) {
    throw new Error(
      'useQuestionsState must be used within a QuestionsProvider',
    );
  }

  return stateContext;
};

const useWsDispatch = () => {
  const dispatchContext = useContext(WSDispatchContext);
  if (dispatchContext === undefined) {
    throw new Error(
      'useQuestionsDispatch must be used within a QuestionsProvider',
    );
  }
  return dispatchContext;
};

const useWS: () => [IWSState, Dispatch] = () => {
  return [useWSState(), useWsDispatch()];
};

export { useWS, WSProvider };
