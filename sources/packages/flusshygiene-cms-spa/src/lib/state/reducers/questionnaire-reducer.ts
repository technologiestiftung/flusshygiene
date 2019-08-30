export const SET_ANSWER = 'SET_ANSWER';
export const SETUP_ANSWERS = 'SETUP_ANSWERS';

interface IState {
  data: any[];
}
const initialState: IState = { data: [] };

export default (state = initialState, action) => {
  // console.log(action.payload);
  switch (action.type) {
    case SET_ANSWER: {
      const res = {
        data: [
          ...state.data.slice(0, action.payload.qindex),
          action.payload.value,
          ...state.data.slice(action.payload.qindex),
        ],
      };
      return res;
    }
    case SETUP_ANSWERS: {
      console.log(action.payload.num);
      return { data: new Array(action.payload.num) };
    }
    default: {
      return state;
    }
  }
};

export const setupAnswersStore = (num: number) => {
  return { type: SETUP_ANSWERS, payload: { num } };
};
export const setAnswerStore = (qindex: number, value?: string) => {
  return { type: SET_ANSWER, payload: { qindex, value } };
};
