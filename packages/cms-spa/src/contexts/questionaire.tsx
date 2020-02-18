import React, { createContext, useContext, useReducer } from 'react';
import { getQuestions } from '../questionnaire-data';
import {
  loadState,
  saveState,
  clearState,
} from '../lib/persist-state/local-storage';
// see https://kentcdodds.com/blog/how-to-use-react-context-effectively
//----
export interface IQuestionsState {
  questions: any[];
  answers: any[];
  title: string;
  // updateAnswer: (i: number, answer: string) => void;
}
interface IAction {
  type: 'SET_ANSWER' | 'REMOVE_ANSWERS' | 'SET_TITLE' | 'SET_STATE';
  payload?: { [key: string]: any };
}
export interface IActionSetAnswer extends IAction {
  payload: { index: number; answer: string };
}
interface IActionSetTitle extends IAction {
  payload: { title: string };
}

interface IActionSetState extends IAction {
  payload: { state: IQuestionsState };
}
type Dispatch = (action: IAction | IActionSetAnswer | IActionSetTitle) => void;
type QuestionsProviderProps = { children: React.ReactNode };

const localStateKey = 'standortbewertung';
let questions: any[] = [];
let answers: string[] = [];
let title: string = '';

(async () => {
  const data = await getQuestions();
  // console.log(data[0]);
  // console.log(data);
  questions = [...data];
  const localAnswerState = loadState(localStateKey);
  if (localAnswerState === undefined) {
    answers = new Array(questions.length);
    title = '';
  } else {
    answers =
      localAnswerState.answers === undefined
        ? new Array(questions.length)
        : localAnswerState.answers;
    title = localAnswerState.title === undefined ? '' : localAnswerState.title;
  }
  // setQuestions((prevState) => {
  //   const newState = [...prevState, ...data];
  //   setAnswers(new Array(newState.length));
  //   return newState;
  // });
})();
const QuestionsStateContext = createContext<IQuestionsState | undefined>(
  undefined,
);
const QuestionsDispatchContext = createContext<Dispatch | undefined>(undefined);

const answersReducer = (state: IQuestionsState, action: IAction) => {
  switch (action.type) {
    case 'SET_ANSWER': {
      const locAction = action as IActionSetAnswer;
      const index = locAction.payload.index;
      const answer = locAction.payload.answer;
      const tmp = [...state.answers];
      tmp[index] = answer;
      saveState(localStateKey, { answers: tmp });
      return { ...state, answers: tmp };
    }
    case 'REMOVE_ANSWERS': {
      clearState(localStateKey);
      return { ...state, answers: [new Array(state.questions)] };
    }
    case 'SET_TITLE': {
      const locAction = action as IActionSetTitle;
      saveState(localStateKey, {
        answers: state.answers,
        title: locAction.payload.title,
      });

      return { ...state, title: locAction.payload.title };
    }
    case 'SET_STATE': {
      const localAction = action as IActionSetState;
      const uploadedState = localAction.payload.state;

      return { ...uploadedState };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
const QuestionsProvider = ({ children }: QuestionsProviderProps) => {
  const [state, dispatch] = useReducer(answersReducer, {
    questions,
    answers,
    title,
  });

  return (
    <QuestionsStateContext.Provider value={state}>
      <QuestionsDispatchContext.Provider value={dispatch}>
        {children}
      </QuestionsDispatchContext.Provider>
    </QuestionsStateContext.Provider>
  );
};

const useQuestionsState = () => {
  const stateContext = useContext(QuestionsStateContext);
  if (stateContext === undefined) {
    throw new Error(
      'useQuestionsState must be used within a QuestionsProvider',
    );
  }

  return stateContext;
};

const useQuestionsDispatch = () => {
  const dispatchContext = useContext(QuestionsDispatchContext);
  if (dispatchContext === undefined) {
    throw new Error(
      'useQuestionsDispatch must be used within a QuestionsProvider',
    );
  }
  return dispatchContext;
};

const useQuestions: () => [IQuestionsState, Dispatch] = () => {
  return [useQuestionsState(), useQuestionsDispatch()];
};

export { useQuestions, QuestionsProvider };
