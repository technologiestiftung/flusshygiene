import { IBathingspot, IAction } from '../../common/interfaces';
import { DEFAULT_SPOT_ID } from '../../common/constants';

export const FETCH_SINGLESPOT_BEGIN = 'FETCH_SINGLESPOT_BEGIN';
export const FETCH_SINGLESPOT_SUCCESS = 'FETCH_SINGLESPOT_SUCCESS';
export const FETCH_SINGLESPOT_FAIL = 'FETCH_SINGLESPOT_FAIL';
export const FETCH_SINGLESPOT_RESET = 'FETCH_SINGLESPOT_RESET';

interface IState {
  spot: IBathingspot;
  loading: boolean;
  error: any;
  truncated?: boolean;
}

const initialState: IState = {
  spot: {
    id: DEFAULT_SPOT_ID,
    createdAt: new Date(2525),
    updatedAt: new Date(2525),
    name: 'Lade Badestellendaten',
    isPublic: false,
  },
  loading: false,
  error: null,
  truncated: true,
};
// Action creators

export const fetchSingleSpotBegin = (): IAction => ({
  type: FETCH_SINGLESPOT_BEGIN,
});

export const fetchSingleSpotSuccess: (
  spot: IBathingspot[],
  truncated: boolean,
) => IAction = (spot, truncated) => ({
  type: FETCH_SINGLESPOT_SUCCESS,
  payload: { spot, truncated },
});

export const fetchSingleSpotFail: (error: any) => IAction = (error) => ({
  type: FETCH_SINGLESPOT_FAIL,
  payload: { error },
});

// reducer
export default function singleSpotReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SINGLESPOT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
        truncated: true,
      };
    case FETCH_SINGLESPOT_SUCCESS:
      // const combined = [...state.spots, ...action.payload.spots];
      // const reduced = combined.reduce((acc, current) => {
      //   const x = acc.find((item) => item.id === current.id);
      //   if (!x) {
      //     return acc.concat([current]);
      //   } else {
      //     return acc;
      //   }
      // }, []);
      // console.log(reduced);
      return {
        ...state,
        truncated: action.payload.truncated,
        loading: false,
        spot: action.payload.spot,
      };
    case FETCH_SINGLESPOT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        truncated: false,
      };
    case FETCH_SINGLESPOT_RESET:
      return { ...state, truncated: undefined };
    default:
      return state;
  }
}
