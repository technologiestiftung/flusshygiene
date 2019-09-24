import React, { createContext, useContext, useReducer } from 'react';
import { getQuestions } from '../questionnaire-data';
// see https://kentcdodds.com/blog/how-to-use-react-context-effectively
//----
interface IQuestionsState {
  questions: any[];
  answers: any[];
  // updateAnswer: (i: number, answer: string) => void;
}
interface IAction {
  type: 'SET_ANSWER';
  payload: { [key: string]: any };
}
interface IActionSetAnswer extends IAction {
  payload: { index: number; answer: string };
}
type Dispatch = (action: IAction) => void;
type QuestionsProviderProps = { children: React.ReactNode };

let questions: any[] = [];
let answers: string[] = [];

(async () => {
  const data = await getQuestions();
  // console.log(data);
  questions = [...data];
  answers = new Array(questions.length);
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
      return { ...state, answers: tmp };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
const QuestionsProvider = ({ children }: QuestionsProviderProps) => {
  const [state, dispatch] = useReducer(answersReducer, {
    questions,
    answers,
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
