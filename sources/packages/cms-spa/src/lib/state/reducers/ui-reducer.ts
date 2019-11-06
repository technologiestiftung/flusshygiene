export const TOGGLE = 'ui/toggle';

// Reducer
const initialState = {
  toggle: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE: {
      return {
        ...state,
        toggle: !state.toggle,
      };
    }

    default: {
      return { ...state };
    }
  }
};

// action creator
export const toggleSwitch = () => (dispatch) => {
  dispatch({ type: TOGGLE });
};
