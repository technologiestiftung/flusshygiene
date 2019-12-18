import React, { createContext, useReducer, useContext } from 'react';
import {
  IApiAction,
  IApiState,
  ApiActionTypes,
  IBathingspot,
  IApiActionFinished,
  IDefaultMeasurement,
  IPurificationPlant,
  IGenericInput,
} from '../lib/common/interfaces';

function matchSpotId(action: IApiAction) {
  const reg = /bathingspots\/(?<spotId>\d+)/;
  const matchRes = action.payload.url.match(reg);
  if (matchRes === null || matchRes.groups === undefined) {
    throw new Error(`Can't match spotId in ${action.payload.url}`);
  }
  const spotId = parseInt(matchRes.groups.spotId, 10);
  return spotId;
}

type Dispatch = (action: IApiAction) => void;
type ApiProviderProps = { children: React.ReactNode };
const hasSubItemsList = ['genericInputs', 'purificationPlants'];

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
      // console.log('apiReducer case START', action);
      return { ...state, loading: true };
    }
    case ApiActionTypes.FINISH_API_REQUEST: {
      action = action as IApiActionFinished;
      // console.log('apiReducer case FINISH', action);
      if (action.payload.requestType === undefined) {
        throw new Error(missingRequestTypeErrorMsg);
      }
      if (action.payload.response === undefined) {
        throw new Error('The action.payload.response from the API is missing');
      }

      //    ********  ******** **********
      //   **//////**/**///// /////**///
      //  **      // /**          /**
      // /**         /*******     /**
      // /**    *****/**////      /**
      // //**  ////**/**          /**
      //  //******** /********    /**
      //   ////////  ////////     //
      /**
       * If it is a GET call we need to handle all the updates of the state
       * If it is a PUT, POST, DELETE we only need to trigger another GET call
       */
      let spotId: number;
      if (action.payload.requestType.resource !== 'bathingspots') {
        spotId = matchSpotId(action);
      }
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
            const newSpots = state.spots;
            action.payload.response.data.forEach((obj) => {
              const index = newSpots.findIndex((spot) => spot.id === obj.id);
              if (index === -1) {
                newSpots.push(obj as IBathingspot);
              } else {
                newSpots[index] = obj as IBathingspot;
              }
            });
            newSpots.sort((a, b) => (a.id > b.id ? -1 : 1));
            return {
              ...state,
              loading: false,
              truncated: action.payload.response.truncated,
              spots: [...newSpots],
            };
          }
          case 'bathingspot': {
            // const spotId = matchSpotId(action);
            // console.log('url in spot request', action.payload.url);

            // console.log(matchRes);

            /**
             * if the state already contains a spot with that ID we update it
             */
            if (state.spots.some((spot) => spot.id === spotId)) {
              const spots = state.spots.map((spot) => {
                if (spot.id === spotId) {
                  return action.payload.response!.data[0] as IBathingspot;
                } else {
                  return spot;
                }
              });
              return { ...state, loading: false, spots };
            } else {
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
          case 'genericInputs': {
            // console.log('update gi');

            let reloadSubItems = state.reloadSubItems;
            const updatedSpots = state.spots.map((spot) => {
              if (spot.id === spotId) {
                spot.genericInputs = action.payload.response!
                  .data as IGenericInput[];
                reloadSubItems = state.reloadSubItems + 1;
              }
              return spot;
            });

            return {
              ...state,
              spots: [...updatedSpots],
              reloadSubItems,
              loading: false,
            };
          }
          case 'gInputMeasurements': {
            // console.log('genericInputs update in postgres-api.tsx');
            const reg = /genericInputs\/(?<pplantId>\d+)/;
            const matchRes = action.payload.url.match(reg);
            if (matchRes === null || matchRes.groups === undefined) {
              throw new Error(
                `Can't match genericInputs id in ${action.payload.url}`,
              );
            }
            const giId = parseInt(matchRes.groups.pplantId, 10);
            // console.log(action.payload.response);
            const updatedSpots = state.spots.map((spot) => {
              if (spot.id === spotId && spot.genericInputs !== undefined) {
                const updatedGis = spot.genericInputs.map((gi) => {
                  if (gi.id === giId) {
                    gi.measurements = action.payload.response!
                      .data as IDefaultMeasurement[];
                  }
                  return gi;
                });
                spot.genericInputs = updatedGis;
              }
              return spot;
            });
            return { ...state, spots: [...updatedSpots], loading: false };
          }
          case 'purificationPlants': {
            // console.log('Updating pplants');
            let reloadSubItems = state.reloadSubItems;

            const updatedSpots = state.spots.map((spot) => {
              if (spot.id === spotId) {
                spot.purificationPlants = action.payload.response!
                  .data as IPurificationPlant[];
                reloadSubItems = state.reloadSubItems + 1;
              }
              return spot;
            });

            return {
              ...state,
              spots: [...updatedSpots],
              reloadSubItems,
              loading: false,
            };
          }
          case 'pplantMeasurements': {
            // console.log('pplantMeasurements update in postgres-api.tsx');
            const reg = /purificationPlants\/(?<pplantId>\d+)/;
            const matchRes = action.payload.url.match(reg);
            if (matchRes === null || matchRes.groups === undefined) {
              throw new Error(
                `Can't match purificationPlant id in ${action.payload.url}`,
              );
            }
            const pplantId = parseInt(matchRes.groups.pplantId, 10);
            console.log(action.payload.response);
            const updatedSpots = state.spots.map((spot) => {
              if (spot.id === spotId && spot.purificationPlants !== undefined) {
                const updatedPlants = spot.purificationPlants.map((plant) => {
                  if (plant.id === pplantId) {
                    plant.measurements = action.payload.response!
                      .data as IDefaultMeasurement[];
                  }
                  return plant;
                });
                spot.purificationPlants = updatedPlants;
              }
              return spot;
            });
            return { ...state, spots: [...updatedSpots], loading: false };
          }
          case 'predictions': {
            // const spotId = matchSpotId(action);

            const updatedSpots = state.spots.map((spot) => {
              if (spot.id === spotId) {
                spot.predictions = action.payload.response!.data;
              }
              return spot;
            });

            return { ...state, spots: [...updatedSpots], loading: false };
          }
          case 'measurements': {
            const spotId = matchSpotId(action);

            const updatedSpots = state.spots.map((spot) => {
              if (spot.id === spotId) {
                spot.measurements = action.payload.response!.data;
              }
              return spot;
            });

            return { ...state, spots: [...updatedSpots], loading: false };
          }
          case 'discharges': {
            // const spotId = matchSpotId(action);

            const updatedSpots = state.spots.map((spot) => {
              if (spot.id === spotId) {
                spot.discharges = action.payload.response!
                  .data as IDefaultMeasurement[];
              }
              return spot;
            });

            return {
              ...state,
              spots: [...updatedSpots],
              loading: false,
            };
          }
          case 'globalIrradiances': {
            // const spotId = matchSpotId(action);

            const updatedSpots = state.spots.map((spot) => {
              if (spot.id === spotId) {
                spot.globalIrradiances = action.payload.response!
                  .data as IDefaultMeasurement[];
              }
              return spot;
            });

            return {
              ...state,
              spots: [...updatedSpots],
              loading: false,
            };
          }
          case 'rains': {
            // const spotId = matchSpotId(action);

            const updatedSpots = state.spots.map((spot) => {
              if (spot.id === spotId) {
                spot.rains = action.payload.response!
                  .data as IDefaultMeasurement[];
              }
              return spot;
            });

            return {
              ...state,
              spots: [...updatedSpots],
              loading: false,
            };
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
          case 'purificationPlants':
          case 'genericInputs':
          case 'bathingspot':
          case 'measurements':
          case 'discharges':
          case 'globalIrradiances': {
            console.log(`POST data for ${action.payload.requestType.resource}`);
            console.log(action.payload.response);

            const reload = state.reload + 1;
            let reloadSubItems = state.reloadSubItems;
            if (
              hasSubItemsList.includes(action.payload.requestType.resource) ===
              true
            ) {
              reloadSubItems = state.reloadSubItems + 1;
            }
            return { ...state, reload, reloadSubItems, loading: false };
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
          case 'discharges':
          case 'globalIrradiances':
          case 'purificationPlants':
          case 'genericInputs':
          case 'measurements': {
            console.log('PUT bathingspot or measurements');
            console.log(action.payload.response);
            const reload = state.reload + 1;
            let reloadSubItems = state.reloadSubItems;
            if (
              hasSubItemsList.includes(action.payload.requestType.resource) ===
              true
            ) {
              console.log('reload suitem update');

              reloadSubItems = state.reloadSubItems + 1;
            }
            return { ...state, reload, reloadSubItems, loading: false };
          }
          default: {
            throw new Error('no default PUT case defined');
          }
        }
      } else {
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
    reload: 0,
    reloadSubItems: 0,
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
      // console.info('apiRequest response ok');
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
    let json: any;
    try {
      json = await response!.json();
    } catch (e) {
      json = { message: await response!.text() };
    }
    dispatch({
      type: ApiActionTypes.FAIL_API_REQUEST,
      payload: { ...action.payload, error: json, response: json },
    });
  }
  // console.groupEnd();
};
export { useApi, ApiProvider, apiRequest };
