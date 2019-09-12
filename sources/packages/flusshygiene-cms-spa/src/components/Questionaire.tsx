import React, { useEffect, useState } from 'react';
import { Container } from './Container';
import { getQuestions } from '../questionnaire-data';
import { QIntro } from './questionaire/QIntro';
import { QToolBar } from './questionaire/QToolBar';
import { Formik, Form, FieldArray, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// import Pagination from 'bulma-pagination-react';
import { Pagination } from './questionaire/Pagination';
import {
  setupAnswersStore,
  setAnswerStore,
} from '../lib/state/reducers/questionnaire-reducer';
import { RootState } from '../lib/state/reducers/root-reducer';
import * as Yup from 'yup';

// interface IInfo {
//   [key:string]: any;
// }

interface IAnswer {
  text: string;
  colorText: 'grün' | 'gelb' | 'orange' | 'türkis' | 'rot';
  additionalText: string;
  id: string;
  weight: number;
  answer?: string;
}

export const Questionaire: React.FC<{}> = () => {
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [modalIsActive, setmodalIsActive] = useState(true);
  const [questions, setQuestions] = useState();
  // const [questionSet, setQuestionSet] = useState(undefined);
  const [qInfo, setQInfo] = useState('');
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [qId, setQId] = useState(0);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const dispatch = useDispatch();
  const [qAddInfo, setQAddInfo] = useState('');
  const [aAddInfo, setAAddInfo] = useState<string | undefined>(undefined);
  const questionaireStoreIsReady = useSelector(
    (state: RootState) => state.questionaire.ready,
  );

  useEffect(() => {
    getQuestions()
      .then((data) => {
        // console.log(data[0][0]);
        setQuestions(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // console.log('questions', questions);
      });
    return () => {};
  }, []);

  useEffect(() => {
    if (answers.length === 0) {
      return;
    }
    if (answers.length > 0) {
      setFormReadyToRender(true);
    }
  }, [answers]);
  useEffect(() => {
    if (questions === undefined) {
      return;
    }
    if (questionaireStoreIsReady === false) {
      dispatch(setupAnswersStore(questions.length));
    }

    // setQuestionSet(questions[qId].default);

    setTitle(questions[qId].default[1][1]);
    setQInfo(questions[qId].default[1][3]);
    setQuestion(questions[qId].default[1][4]);
    setQAddInfo(questions[qId].default[1][5]);
    // console.log(questions);
  }, [questions, qId, dispatch, questionaireStoreIsReady]);

  useEffect(() => {
    if (questions === undefined) {
      return;
    }
    const data = questions[qId].default;
    const localAnswers: IAnswer[] = [];
    for (let i = 1; i < data.length; i++) {
      // console.log(data[i][6]);
      // if (data[i][6] === null) {
      //   break;
      // }
      const answer: IAnswer = {
        additionalText: data[i][7],
        colorText: data[i][9],
        text: data[i][6],
        id: `${qId}-a${i - 1}-w${data[i][0]}`,
        weight: data[i][0],
      };
      localAnswers.push(answer);
    }
    setAnswers(localAnswers);
    // console.log(localAnswers);
  }, [questions, qId]);
  return (
    <>
      <div className={`modal ${modalIsActive === true ? 'is-active' : ''}`}>
        <div className='modal-background'></div>
        <div className='modal-content'>
          <div className='box'>
            <QIntro />
          </div>
          <button
            className='modal-close is-large'
            aria-label='close'
            onClick={() => {
              setmodalIsActive(false);
            }}
          ></button>
        </div>
      </div>
      {formReadyToRender === true && (
        <Formik
          initialValues={{ answers, answer: undefined }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            answers: Yup.array(Yup.string()).required(
              'Bitte wählen sie mindestens eine Options um zu speichern',
            ),
          })}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submitted', values);
            dispatch(setAnswerStore(qId, values.answer));

            setSubmitting(false);
            setQId((prevState) => {
              const newState = prevState + 1;
              if (newState >= questions.length) {
                console.log('GOTO REPORT');
                return prevState;
              }
              return newState;
            });
          }}
        >
          {({ values, isSubmitting, handleChange, isValid, submitForm }) => {
            // console.log(values);
            return (
              <>
                <Form>
                  <Container>
                    <QToolBar
                      isSubmitting={isSubmitting}
                      handleClick={(event: React.ChangeEvent<any>) => {
                        switch (event.currentTarget.id) {
                          case 'info':
                            setmodalIsActive(true);
                            break;
                        }
                      }}
                    >
                      {questions !== undefined && (
                        <Pagination
                          pages={questions.length}
                          currentPage={qId + 1}
                          isRounded={false}
                          isSmall={true}
                          // isRight={false}
                          isCentered={true}
                          onChange={(
                            event: React.ChangeEvent<any>,
                            page: number,
                          ) => {
                            console.log(event.currentTarget);
                            switch (event.currentTarget.id) {
                              case 'fwd':
                                setQId((prevState) => {
                                  const newState = prevState + 1;
                                  if (newState >= questions.length) {
                                    return prevState;
                                  }
                                  return newState;
                                });
                                break;
                              case 'bwd':
                                setQId((prevState) => {
                                  const newState = prevState - 1;
                                  if (newState < 0) {
                                    return prevState;
                                  }
                                  return newState;
                                });
                                break;
                              default:
                                if (
                                  event.currentTarget.id.startsWith('page-')
                                ) {
                                  const newId = parseInt(
                                    event.currentTarget.id.split('-')[1],
                                    10,
                                  );
                                  console.log('nextId', newId);
                                  if (newId < 0) {
                                    return;
                                  } else if (newId > questions.length) {
                                    return;
                                  } else {
                                    setQId(newId - 1);
                                  }
                                }
                                break;
                            }
                            console.log(page);
                          }}
                        ></Pagination>
                        // </Container>
                      )}
                    </QToolBar>
                  </Container>

                  <Container>
                    <h1 className={'title is-1 q__title'}>{title}</h1>
                    <div className='content'>
                      <p>{qInfo}</p>
                    </div>
                    <div className='content q__question'>
                      <p>Frage:</p>
                      <p>{question}</p>
                      <p>
                        <em>{qAddInfo}</em>
                      </p>
                    </div>
                    <div className='q__answer'>
                      <div className='content'>
                        <p>Antworten:</p>
                      </div>
                      <div className='q__answer-info'>
                        <div className='content'></div>
                      </div>
                    </div>
                    {/* <button
                      type='submit'
                      className={'button is-small'}
                      disabled={isSubmitting}
                    >
                      Antwort Speichern
                    </button> */}
                    <div className='control'>
                      <FieldArray
                        name='answers'
                        render={(_helpers) => (
                          <div className='control'>
                            {values.answers.map((ele, index) => {
                              if (ele.text === null) {
                                return null;
                              }
                              return (
                                <div key={index} className='field'>
                                  <Field
                                    type='radio'
                                    id={`answer--${index}`}
                                    name={`answer`}
                                    className={'answer'}
                                    // id={`${i}`}
                                    onChange={(e: React.ChangeEvent<any>) => {
                                      handleChange(e);
                                      console.log(e.target);
                                      setAAddInfo(
                                        answers[`${index}`].additionalText,
                                      );
                                    }}
                                    required
                                    value={answers[`${index}`].id}
                                    // checked={false}
                                  />
                                  <label
                                    htmlFor={`answer--${index}`}
                                    className='radio label__answer'
                                  >
                                    {ele.text}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      />
                    </div>
                  </Container>
                  <Container containerClassName={'answer__additional'}>
                    {aAddInfo !== undefined && (
                      <div className='content notification'>
                        <p>{aAddInfo}</p>
                      </div>
                    )}
                  </Container>
                </Form>
              </>
            );
          }}
        </Formik>
      )}
      <div className='is-danger box is-hidden'>
        Todo:
        <div className='content is-danger'>
          <ul>
            <li>report</li>
            <li>additional infos for answer</li>
            <li>colors mathing</li>
          </ul>
        </div>
      </div>
      <pre className='is-hidden'>
        <code>
          {(() => {
            if (questions !== undefined) {
              return questions[0].default[1];
            }
          })()}
        </code>
      </pre>
    </>
  );
};
