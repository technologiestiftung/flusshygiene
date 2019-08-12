export const FETCH_SPOTS_BEGIN = 'FETCH_SPOTS_BEGIN';
export const FETCH_SPOTS_SUCCESS = 'FETCH_SPOTS_SUCCESS';
export const FETCH_SPOTS_FAIL = 'FETCH_SPOTS_FAIL';
export const FETCH_SPOTS_RESET = 'FETCH_SPOTS_RESET';
interface IAction {
  type: string;
  payload?: any;
}

// Action creators

export const fetchSpotResetTruncated = (): IAction => ({
  type: FETCH_SPOTS_RESET,
});
export const fetchSpotsBegin = (): IAction => ({ type: FETCH_SPOTS_BEGIN });
export const fetchSpotsSuccess: (spots: any, truncated: boolean) => IAction = (
  spots,
  truncated,
) => ({
  type: FETCH_SPOTS_SUCCESS,
  payload: { spots, truncated },
});

export const fetchSpotsFail: (error: any) => IAction = (error) => ({
  type: FETCH_SPOTS_FAIL,
  payload: { error },
});

interface IState {
  spots: any[];
  loading: boolean;
  error: any;
  truncated?: boolean;
}
const initialState: IState = {
  spots: [],
  loading: false,
  error: null,
  truncated: true,
};

// reducer
export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SPOTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SPOTS_SUCCESS:
      return {
        ...state,
        truncated: action.payload.truncated,
        loading: false,
        spots: [...state.spots, ...action.payload.spots],
      };
    case FETCH_SPOTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case FETCH_SPOTS_RESET:
      return { ...state, truncated: undefined };
    default:
      return state;
  }
}
