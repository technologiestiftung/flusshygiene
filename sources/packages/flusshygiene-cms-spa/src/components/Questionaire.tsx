import React, { useEffect, useState } from 'react';
import { Container } from './Container';
import { getQuestions } from '../questionnaire-data';
import { QIntro } from './questionaire/QIntro';
import { QToolBar } from './questionaire/QToolBar';
import { Formik, Form, FieldArray, Field } from 'formik';
import { useDispatch } from 'react-redux';
import {
  setupAnswersStore,
  setAnswerStore,
} from '../lib/state/reducers/questionnaire-reducer';

// interface IInfo {
//   [key:string]: any;
// }

interface IAnswer {
  text: string;
  colorText: string;
  additionalText: string;
  id: string;
  weight: number;
  answer?: string;
}

export const Questionaire: React.FC<{}> = () => {
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [modalIsActive, setmodalIsActive] = useState(false);
  const [questions, setQuestions] = useState();
  // const [questionSet, setQuestionSet] = useState(undefined);
  const [qInfo, setQInfo] = useState('');
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [qId /*setQId*/] = useState(0);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const dispatch = useDispatch();
  const [qAddInfo, setQAddInfo] = useState('');

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
    dispatch(setupAnswersStore(questions.length));

    // setQuestionSet(questions[qId].default);

    setTitle(questions[qId].default[1][1]);
    setQInfo(questions[qId].default[1][3]);
    setQuestion(questions[qId].default[1][4]);
    setQAddInfo(questions[qId].default[1][5]);
    // console.log(questions);
  }, [questions, qId, dispatch]);

  useEffect(() => {
    if (questions === undefined) {
      return;
    }
    const data = questions[qId].default;
    const localAnswers: IAnswer[] = [];
    for (let i = 1; i < data.length; i++) {
      const answer: IAnswer = {
        additionalText: data[i][7],
        colorText: data[i][9],
        text: data[i][6],
        id: `${qId}-a${i - 1}`,
        weight: data[i][0],
      };
      localAnswers.push(answer);
    }
    setAnswers(localAnswers);
    // console.log(localAnswers);
  }, [questions, qId]);
  return (
    <>
      <Container>
        <QToolBar
          handleClick={() => {
            setmodalIsActive(true);
          }}
        ></QToolBar>
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
      </Container>
      <Container>
        <div className='is-danger box'>
          Todo:
          <div className='content is-danger'>
            <ul>
              <li>pagination</li>
              <li>content swtiching</li>
              <li>report</li>
              <li>additional infos for answer</li>
              <li>colors mathing</li>
              <li>radio to text distance</li>
              <li>
                where does submission happen
                <ul>
                  <li>pagiantion</li>
                  <li>save</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
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
            {/* {answers.map((ele, i) => (
              <div key={i}>
                <p>A: {ele.text}</p>
                <p>A Color: {ele.colorText}</p>
              </div>
            ))} */}
          </div>
          <div>
            {formReadyToRender === true && (
              <Formik
                initialValues={{ answers, answer: undefined }}
                onSubmit={(values, { setSubmitting }) => {
                  console.log('submitted', values);
                  dispatch(setAnswerStore(qId, values.answer));
                  setSubmitting(false);
                }}
              >
                {({ values, isSubmitting, handleChange }) => {
                  // console.log(values);
                  return (
                    <Form>
                      <button type='submit' disabled={isSubmitting}>
                        Submit
                      </button>
                      <div className='control'>
                        <FieldArray
                          name='answers'
                          render={(_helpers) => (
                            <div className='control'>
                              {values.answers.map((ele, index) => {
                                return (
                                  <div key={index} className='field'>
                                    <Field
                                      type='radio'
                                      id={`answer--${index}`}
                                      name={`answer`}
                                      // id={`${i}`}
                                      onChange={(e) => {
                                        handleChange(e);
                                        console.log(e.target);
                                      }}
                                      required
                                      value={answers[`${index}`].id}
                                      // checked={false}
                                    />
                                    <label
                                      htmlFor={`answer--${index}`}
                                      className='radio'
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
                    </Form>
                  );
                }}
              </Formik>
            )}
          </div>
          <div className='q__answer-info'>
            <div className='content'></div>
          </div>
        </div>
        <pre>
          <code>
            {(() => {
              if (questions !== undefined) {
                return questions[0].default[1][1];
              }
            })()}
          </code>
        </pre>
        <pre>
          <code>{JSON.stringify(questions, null, 2)}</code>
        </pre>
      </Container>
    </>
  );
};
