import { IAction } from '../../common/interfaces';

export const POST_SPOTS_BEGIN = 'POST_SPOTS_BEGIN';
export const POST_SPOTS_SUCCESS = 'POST_SPOTS_SUCCESS';
export const POST_SPOTS_FAIL = 'POST_SPOTS_FAIL';

interface IState {
  loading: boolean;
  success?: boolean;
  error: any;
}
const initialState: IState = {
  loading: false,
  success: undefined,
  error: null,
};
// Action creators

export const postSpotBegin = (): IAction => ({
  type: POST_SPOTS_BEGIN,
});

export const postSpotSuccess: (success: boolean, error?: any) => IAction = (
  success,
  error,
) => ({
  type: POST_SPOTS_SUCCESS,
  payload: { success, error },
});

export const postSpotFail: (error: any) => IAction = (error) => {
  console.log(error);
  return {
    type: POST_SPOTS_FAIL,
    payload: { error },
  };
};

export default function postSpotsReducer(state = initialState, action) {
  switch (action.type) {
    case POST_SPOTS_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case POST_SPOTS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.success,
        error: action.payload.error,
      };
    case POST_SPOTS_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
