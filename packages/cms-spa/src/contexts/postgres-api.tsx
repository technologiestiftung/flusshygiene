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

/**
 * The Big old reducer
 * @param state
 * @param action
 */
const apiReducer: (state: IApiState, action: IApiAction) => IApiState = (
  state,
  action,
) => {
  switch (action.type) {
    case ApiActionTypes.START_API_REQUEST: {
      console.log('apiReducer case START', action);
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

      //  ## ### ###
      // #   #    #
      // # # ##   #
      // # # #    #
      //  ## ###  #
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
          case 'bathingspots': {
            /**
             * TODO: Do we need an update of the state or can we just replace them all?
             */
            // console.log('requesting spots');
            // console.log(action.payload.response);
            const newSpots = state.spots;
            action.payload.response.data.forEach((obj) => {
              const index = newSpots.findIndex((spot) => spot.id === obj.id);
              if (index === -1) {
                newSpots.push(obj as IBathingspot);
              } else {
                newSpots[index] = obj as IBathingspot;
              }
            });
            return {
              ...state,
              loading: false,
              reload: false,
              truncated: action.payload.response.truncated,
              spots: [...newSpots],
            };
          }
          case 'bathingspot': {
            // console.log('url in spot request', action.payload.url);
            const reg = /bathingspots\/(?<spotId>\d+?)$/;
            const matchRes = action.payload.url.match(reg);
            // console.log(matchRes);

            if (matchRes === null || matchRes.groups === undefined) {
              throw new Error(`Can't match spotId in ${action.payload.url}`);
            }
            const id = parseInt(matchRes.groups.spotId, 10);

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
              return { ...state, loading: false, spots, reload: false };
            } else {
              /**
               * State does not contain the spot. We Just push the result to the end of the this.state.
               * This is currently not happening in our application flow, but hey. Might be possible some time
               */
              return {
                ...state,
                loading: false,
                reload: false,
                spots: [
                  ...state.spots,
                  action.payload.response!.data[0] as IBathingspot,
                ],
              };
            }
          }
          default: {
            throw new Error('no default GET case defined');
          }
        }

        //  ________  ________  ________  _________
        // |\   __  \|\   __  \|\   ____\|\___   ___\
        // \ \  \|\  \ \  \|\  \ \  \___|\|___ \  \_|
        //  \ \   ____\ \  \\\  \ \_____  \   \ \  \
        //   \ \  \___|\ \  \\\  \|____|\  \   \ \  \
        //    \ \__\    \ \_______\____\_\  \   \ \__\
        //     \|__|     \|_______|\_________\   \|__|
        //                        \|_________|

        /**
         * Here we handle all POST requests
         *
         *
         *
         *
         */
      } else if (action.payload.requestType.type === 'POST') {
        console.log('called POST');
        switch (action.payload.requestType.resource) {
          case 'bathingspot':
          case 'measurements':
          case 'discharges':
          case 'globalIrradiances': {
            console.log(`POST data for ${action.payload.requestType.resource}`);
            console.log(action.payload.response);
            /**
             * TODO: Should dispatch another get call here
             */
            return { ...state, reload: true, loading: false };
          }

          default: {
            throw new Error('no default POST case defined');
          }
        }

        //  *******  **     ** **********
        // /**////**/**    /**/////**///
        // /**   /**/**    /**    /**
        // /******* /**    /**    /**
        // /**////  /**    /**    /**
        // /**      /**    /**    /**
        // /**      //*******     /**
        // //        ///////      //
        /**
         *
         *
         * Handle PUT requests
         *
         *
         */
      } else if (action.payload.requestType.type === 'PUT') {
        console.log('called PUT');
        switch (action.payload.requestType.resource) {
          case 'bathingspot':
          case 'measurements': {
            console.log('PUT bathingspot or measurements');
            console.log(action.payload.response);

            /**
             * TODO: should disptch a new GET here
             */
            return { ...state, reload: true, loading: false };
          }
          default: {
            throw new Error('no default POST case defined');
          }
        }
      } else {
        /**
         * Here we handle PUT, DELETE
         * TODO: trigger another GET call to update the state
         */
        return { ...state, loading: false };
      }
    }
    case ApiActionTypes.FAIL_API_REQUEST: {
      console.error('apiReducer case FAILS', action);

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
    truncated: false,
    reload: false,
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

//           _____                    _____                    _____
//          /\    \                  /\    \                  /\    \
//         /::\    \                /::\    \                /::\    \
//        /::::\    \              /::::\    \               \:::\    \
//       /::::::\    \            /::::::\    \               \:::\    \
//      /:::/\:::\    \          /:::/\:::\    \               \:::\    \
//     /:::/__\:::\    \        /:::/__\:::\    \               \:::\    \
//    /::::\   \:::\    \      /::::\   \:::\    \              /::::\    \
//   /::::::\   \:::\    \    /::::::\   \:::\    \    ____    /::::::\    \
//  /:::/\:::\   \:::\    \  /:::/\:::\   \:::\____\  /\   \  /:::/\:::\    \
// /:::/  \:::\   \:::\____\/:::/  \:::\   \:::|    |/::\   \/:::/  \:::\____\
// \::/    \:::\  /:::/    /\::/    \:::\  /:::|____|\:::\  /:::/    \::/    /
//  \/____/ \:::\/:::/    /  \/_____/\:::\/:::/    /  \:::\/:::/    / \/____/
//           \::::::/    /            \::::::/    /    \::::::/    /
//            \::::/    /              \::::/    /      \::::/____/
//            /:::/    /                \::/____/        \:::\    \
//           /:::/    /                  ~~               \:::\    \
//          /:::/    /                                     \:::\    \
//         /:::/    /                                       \:::\____\
//         \::/    /                                         \::/    /
//          \/____/                                           \/____/

//           _____                    _____                   _______
//          /\    \                  /\    \                 /::\    \
//         /::\    \                /::\    \               /::::\    \
//        /::::\    \              /::::\    \             /::::::\    \
//       /::::::\    \            /::::::\    \           /::::::::\    \
//      /:::/\:::\    \          /:::/\:::\    \         /:::/~~\:::\    \
//     /:::/__\:::\    \        /:::/__\:::\    \       /:::/    \:::\    \
//    /::::\   \:::\    \      /::::\   \:::\    \     /:::/    / \:::\    \
//   /::::::\   \:::\    \    /::::::\   \:::\    \   /:::/____/   \:::\____\
//  /:::/\:::\   \:::\____\  /:::/\:::\   \:::\    \ |:::|    |     |:::|    |
// /:::/  \:::\   \:::|    |/:::/__\:::\   \:::\____\|:::|____|     |:::|____|
// \::/   |::::\  /:::|____|\:::\   \:::\   \::/    / \:::\   _\___/:::/    /
//  \/____|:::::\/:::/    /  \:::\   \:::\   \/____/   \:::\ |::| /:::/    /
//        |:::::::::/    /    \:::\   \:::\    \        \:::\|::|/:::/    /
//        |::|\::::/    /      \:::\   \:::\____\        \::::::::::/    /
//        |::| \::/____/        \:::\   \::/    /         \::::::::/    /
//        |::|  ~|               \:::\   \/____/           \::::::/    /
//        |::|   |                \:::\    \                \::::/____/
//        \::|   |                 \:::\____\                |::|    |
//         \:|   |                  \::/    /                |::|____|
//          \|___|                   \/____/                  ~~

/**
 *
 *API REQUEST
 *API REQUEST
 *API REQUEST
 *API REQUEST
 *API REQUEST
 *API REQUEST
 *API REQUEST
 *
 */
const apiRequest: (dispatch: Dispatch, action: IApiAction) => void = async (
  dispatch,
  action,
) => {
  // console.group('apiRequest');
  // console.info('Starting apiRequest');

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
      console.group('Error Response');
      console.warn('fetch response not ok');
      // console.log(await response.json());
      // console.error(response.body);
      console.groupEnd();
      throw new Error('Network fetch response not ok');
    }
  } catch (error) {
    console.group('Error response catched');
    // console.error(await response!.json());
    console.error('Error while making fetch call', error);
    console.groupEnd();
    const json = await response!.json();
    dispatch({
      type: ApiActionTypes.FAIL_API_REQUEST,
      payload: { ...action.payload, error: json, response: json },
    });
  }
  // console.groupEnd();
};
export { useApi, ApiProvider, apiRequest };
