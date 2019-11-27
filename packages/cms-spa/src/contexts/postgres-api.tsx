import React, { createContext, useReducer, useContext } from 'react';
import {
  IApiAction,
  IApiState,
  ApiActionTypes,
} from '../lib/common/interfaces';

type Dispatch = (action: IApiAction) => void;
type ApiProviderProps = { children: React.ReactNode };

const ApiStateContext = createContext<IApiState | undefined>(undefined);

const ApiDispatchContext = createContext<Dispatch | undefined>(undefined);

const apiReducer: (state: IApiState, action: IApiAction) => IApiState = (
  state,
  action,
) => {
  switch (action.type) {
    case ApiActionTypes.START_API_REQUEST: {
      console.log('apiReducer case START', action);
      return state;
    }
    case ApiActionTypes.FINISH_API_REQUEST: {
      console.log('apiReducer case FINISH', action);

      return state;
    }
    case ApiActionTypes.FAIL_API_REQUEST: {
      console.log('apiReducer case FAILS', action);

      return state;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const ApiProvider: (children: ApiProviderProps) => JSX.Element = ({
  children,
}) => {
  const [state, dispatch] = useReducer(apiReducer, { spots: [] });
  return (
    <ApiStateContext.Provider value={state}>
      <ApiDispatchContext.Provider value={dispatch}>
        {children}
      </ApiDispatchContext.Provider>
    </ApiStateContext.Provider>
  );
};

const useApiState: () => IApiState = () => {
  const stateContext = useContext(ApiStateContext);
  if (stateContext === undefined) {
    throw new Error('useApiState must be used within a QuestionsProvider');
  }

  return stateContext;
};
const useApiDispatch: () => Dispatch = () => {
  const dispatchContext = useContext(ApiDispatchContext);
  if (dispatchContext === undefined) {
    throw new Error('useApiDispatch must be used within a ApiProvider');
  }
  return dispatchContext;
};

const useApi: () => [IApiState, Dispatch] = () => {
  return [useApiState(), useApiDispatch()];
};

const apiRequest: (dispatch: Dispatch, action: IApiAction) => void = async (
  dispatch,
  action,
) => {
  console.info('Starting apiRequest');

  let response: Response;
  dispatch({
    type: ApiActionTypes.START_API_REQUEST,
    payload: { spots: [], url: action.payload.url },
  });
  try {
    response = await fetch(action.payload.url, action.payload.config);
    if (response.ok === true) {
      console.info('apiRequest response ok');
      let json: any;
      try {
        json = await response.json();
      } catch (err) {
        console.error('Error parsing response from fetch call to json', err);
        throw err;
      }
      dispatch({
        type: ApiActionTypes.FINISH_API_REQUEST,
        payload: { response: json, url: action.payload.url },
      });
    } else {
      console.warn('fetch response not ok');
      throw new Error('Network fetch response not ok');
    }
  } catch (error) {
    console.error('Error while making fetch call', error);
    dispatch({
      type: ApiActionTypes.FAIL_API_REQUEST,
      payload: {
        url: action.payload.url,
        error,
      },
    });
  }
};
export { useApi, ApiProvider, apiRequest };
