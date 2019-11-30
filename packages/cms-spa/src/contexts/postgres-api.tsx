import React, { createContext, useReducer, useContext } from 'react';
import {
  IApiAction,
  IApiState,
  ApiActionTypes,
  IBathingspot,
  IApiActionFinished,
} from '../lib/common/interfaces';

type Dispatch = (action: IApiAction) => void;
type ApiProviderProps = { children: React.ReactNode };

const ApiStateContext = createContext<IApiState | undefined>(undefined);

const ApiDispatchContext = createContext<Dispatch | undefined>(undefined);
const missingRequestTypeErrorMsg =
  'You need to define the request type opject on the payload. See "IApiActionRequestType" in interface.ts';

const apiReducer: (state: IApiState, action: IApiAction) => IApiState = (
  state,
  action,
) => {
  console.group('api reducer');
  switch (action.type) {
    case ApiActionTypes.START_API_REQUEST: {
      console.log('apiReducer case START', action);
      console.groupEnd();
      return { ...state, loading: true };
    }
    case ApiActionTypes.FINISH_API_REQUEST: {
      action = action as IApiActionFinished;
      console.log('apiReducer case FINISH', action);
      if (action.payload.requestType === undefined) {
        throw new Error(missingRequestTypeErrorMsg);
      }
      if (action.payload.response === undefined) {
        throw new Error('The action.payload.response from the API is missing');
      }
      /**
       * If it is a GET call we need to handle all the updates of the state
       * If it is a PUT, POST, DELETE we only need to trigger another GET call
       */
      if (action.payload.requestType.type === 'GET') {
        /**
         * Now we switch based on the resource type we are getting
         *
         */
        switch (action.payload.requestType.resource) {
          /**
           * This is getting a single spot
           */
          case 'bathingspot': {
            /**
             * FIXME: We need to get the id from the URL or we need to pass it along. Better we take it from the URL so we don't have to handle another resource
             */
            const id = 1;
            /**
             * if the state already contains a spot with that ID we update it
             */
            if (state.spots.some((spot) => spot.id === id)) {
              const spots = state.spots.map((spot) => {
                if (spot.id === id) {
                  return action.payload.response!.data[0] as IBathingspot;
                } else {
                  return spot;
                }
              });
              console.groupEnd();
              return { ...state, loading: false, spots };
            } else {
              console.groupEnd();
              /**
               * State does not contain the spot. We Just push the result to the end of the this.state.
               * This is currently not happening in our application flow, but hey. Might be possible some time
               */
              return {
                ...state,
                loading: false,
                spots: [
                  ...state.spots,
                  action.payload.response!.data[0] as IBathingspot,
                ],
              };
            }
          }
          default: {
            throw new Error('no default case defined');
          }
        }
      } else {
        /**
         * Here we handle POST, PUT, DELETE
         * TODO: trigger another GET call to update the state
         */
        console.groupEnd();
        return { ...state, loading: false };
      }
    }
    case ApiActionTypes.FAIL_API_REQUEST: {
      console.log('apiReducer case FAILS', action);
      console.groupEnd();

      return { ...state, loading: false, error: action.payload.error };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const ApiProvider: (children: ApiProviderProps) => JSX.Element = ({
  children,
}) => {
  const [state, dispatch] = useReducer(apiReducer, {
    spots: [],
    loading: false,
  });
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
  console.group('apiRequest');
  console.info('Starting apiRequest');

  let response: Response;
  dispatch({
    type: ApiActionTypes.START_API_REQUEST,
    payload: action.payload,
  });
  const { requestType } = action.payload;
  if (requestType === undefined) {
    throw new Error(missingRequestTypeErrorMsg);
  }
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
        payload: { response: json, url: action.payload.url, requestType },
      } as IApiActionFinished);
    } else {
      console.warn('fetch response not ok');
      throw new Error('Network fetch response not ok');
    }
  } catch (error) {
    console.error('Error while making fetch call', error);
    dispatch({
      type: ApiActionTypes.FAIL_API_REQUEST,
      payload: action.payload,
    });
  }
  console.groupEnd();
};
export { useApi, ApiProvider, apiRequest };
