import React, { useEffect } from 'react';
import { useQuestions } from '../../contexts/questionaire';
import { useState } from 'react';
import { Formik, Form, FieldArray, Field } from 'formik';
import { Container } from '../Container';
import { QToolBar } from './QToolBar';
import { Pagination } from './Pagination';
import history from '../../lib/history';
import { RouteNames } from '../../lib/common/enums';
import { IAnswer } from '../../lib/common/interfaces';
import { colorNameToIcon, questionTypeToIcon } from '../fontawesome-icons';
import { createLinks } from '../../lib/utils/questionnaire-additional-texts-filter';

/**
 * Component holds all the question logic
 *
 */
export const Question: React.FC<{ qid: number }> = ({ qid }) => {
  const [title, setTitle] = useState('');
  const [qInfo, setQInfo] = useState('');
  const [question, setQuestion] = useState('');
  const [qAddInfo, setQAddInfo] = useState('');
  const [curAnswers, setCurAnswers] = useState<IAnswer[]>([]);
  // const [questionType, setQuestionType] = useState<string>();
  const [aAddInfo, setAAddInfo] = useState('');

  const [state, dispatch] = useQuestions();
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [answersIds, setAnswersIds] = useState<string[]>([]);

  useEffect(() => {
    if (state.questions === undefined) return;
    if (state.questions.length - 1 < qid) return;
    setTitle(state.questions[qid].default[1][1]);
    setQInfo(state.questions[qid].default[1][3]);
    setQuestion(state.questions[qid].default[1][4]);
    setQAddInfo(createLinks(state.questions[qid].default[1][5]));

    const q = state.questions[qid].default;
    // console.log(q);
    const localAnswers: IAnswer[] = [];

    for (let i = 1; i < q.length; i++) {
      if (q[i][6] === null) {
        continue;
      }
      // if (q[i][11] !== null) {
      //   setQuestionType(q[i][11].toLowerCase());
      //   console.log(q[i][11]);
      // }
      const answer: IAnswer = {
        additionalText: createLinks(q[i][7]),
        colorText: q[i][9],
        text: q[i][6],
        id: `${qid}-a${i - 1}-w${q[1][0]}-p${q[i][10]}`,
        weight: q[1][0],
        possibility: q[i][10],
        qType: q[i][11] !== null ? q[i][11].toLowerCase() : undefined,
      };
      // console.log('ids of answers for this view', answer.id);
      // console.log('all current answers in state', state.answers);
      // console.log(answersIds);
      // console.log('qid', qid);
      // if (state.answers.includes(answer.id)) {
      //   console.log('got a match from the state');
      //   console.log(answer.id, state.answers[qid]);
      //   // setAnswersIds([answer.id]);
      //   setAnswersIds((prevState) => {
      //     const nextState: string[] = [state.answers[qid]];
      //     console.log('setting new answer id', [state.answers[qid]]);
      //     return nextState;
      //   });
      // } else {
      //   setAnswersIds((_) => {
      //     return [];
      //   });
      // }
      localAnswers.push(answer);
    }
    setCurAnswers(localAnswers);
    setAAddInfo('');
    setFormReadyToRender(true);
  }, [state.questions, qid, state.answers]);

  useEffect(() => {
    if (curAnswers.length === 0) return;
    for (const item of curAnswers) {
      // console.log(item);
      if (state.answers.includes(item.id) === true) {
        setAnswersIds([item.id]);
        setAAddInfo(item.additionalText);
      }
    }
    return () => {};
  }, [state.answers, curAnswers]);
  return (
    <>
      {formReadyToRender === true && (
        <Formik
          initialValues={{
            answersIds: answersIds,
            answer: undefined,
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            console.log('submitted', values);
            dispatch({
              type: 'SET_ANSWER',
              payload: {
                index: qid,
                answer:
                  values.answersIds[0] === undefined
                    ? null
                    : values.answersIds[0],
              },
            });
            setSubmitting(false);
            resetForm();
          }}
        >
          {({ values, isSubmitting, handleChange, resetForm }) => {
            // const newState:Partial<FormikState<{ answersIds: string[]; answer: undefined; }>> = {answersIds:[...answersIds], answers: undefined}
            // resetForm();
            const answerDispatch = () => {
              if (values.answersIds.length > 0) {
                const answerQid = values.answersIds[0].split('-')[0];
                if (parseInt(answerQid, 10) === qid) {
                  dispatch({
                    type: 'SET_ANSWER',
                    payload: {
                      index: qid,
                      answer:
                        values.answersIds[0] === undefined
                          ? null
                          : values.answersIds[0],
                    },
                  });
                  resetForm();
                }
              }
            };
            return (
              <>
                <Form>
                  <Container>
                    <QToolBar
                      isSubmitting={isSubmitting}
                      handleInfoClick={(e: React.ChangeEvent<any>) => {
                        // calls info button
                        console.log(e.currentTarget.id);
                      }}
                      handleReportClick={(e: React.ChangeEvent<any>) => {
                        answerDispatch();
                        history.push(`/${RouteNames.questionnaire}/report`);
                      }}
                      handleResetClick={(e: React.ChangeEvent<any>) => {
                        dispatch({ type: 'REMOVE_ANSWERS' });
                        setAnswersIds([]);
                        resetForm();
                      }}
                    >
                      <Pagination
                        pages={state.questions.length - 1}
                        currentPage={qid}
                        isRounded={false}
                        isSmall={true}
                        isCentered={true}
                        onChange={(
                          _event: React.ChangeEvent<any>,
                          _page: number,
                        ) => {
                          // console.log(values.answersIds);
                          answerDispatch();
                        }}
                      ></Pagination>
                    </QToolBar>
                  </Container>
                  <Container>
                    <h1 className='title is-1'>{title}</h1>
                    <div className='content'>
                      <p>{qInfo}</p>
                    </div>
                    <div className='content'>
                      <p className='title'>Frage:</p>

                      <p>
                        <strong>{question}</strong>
                      </p>
                      <p dangerouslySetInnerHTML={{ __html: qAddInfo }} />
                    </div>
                    <div className='content'>
                      <p className='title'>Antworten:</p>
                      <div className='control'>
                        <FieldArray
                          name='answersIds'
                          render={(arrayHelpers) => {
                            return (
                              <>
                                {curAnswers.map((ele, i) => {
                                  return (
                                    <div key={i} className='field'>
                                      <Field
                                        type='radio'
                                        id={`answer--${i}`}
                                        name={`answers`}
                                        className={'answer'}
                                        onChange={(
                                          e: React.ChangeEvent<any>,
                                        ) => {
                                          handleChange(e);
                                          arrayHelpers.replace(0, ele.id);
                                          setAAddInfo(ele.additionalText);
                                        }}
                                        required
                                        value={ele.id}
                                        checked={values.answersIds.includes(
                                          ele.id,
                                        )}
                                      />
                                      <label
                                        htmlFor={`answer--${i}`}
                                        className={'radio label__answer'}
                                      >
                                        {ele.text}{' '}
                                        <span>
                                          {values.answersIds.includes(
                                            ele.id,
                                          ) === true &&
                                            colorNameToIcon(ele.colorText)}{' '}
                                          {values.answersIds.includes(
                                            ele.id,
                                          ) === true &&
                                            ele.qType !== undefined &&
                                            questionTypeToIcon(
                                              ele.qType,
                                              ele.colorText,
                                            )}
                                        </span>
                                      </label>
                                    </div>
                                  );
                                })}
                              </>
                            );
                          }}
                        ></FieldArray>
                      </div>
                    </div>

                    <div className='content'>
                      <p dangerouslySetInnerHTML={{ __html: aAddInfo }} />
                    </div>
                  </Container>
                </Form>
              </>
            );
          }}
        </Formik>
      )}
    </>
  );
};
