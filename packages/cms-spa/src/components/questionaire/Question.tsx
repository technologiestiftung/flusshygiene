import React, { useEffect } from 'react';
import { useQuestions } from '../../contexts/questionaire';
import { useState } from 'react';
import { Formik, Form, FieldArray, Field, FormikState } from 'formik';
import { Container } from '../Container';
import { QToolBar } from './QToolBar';
import { Pagination } from './Pagination';
import history from '../../lib/history';
import { RouteNames } from '../../lib/common/enums';
import { IAnswer, ClickFunction } from '../../lib/common/interfaces';
import { createLinks } from '../../lib/utils/questionnaire-additional-texts-filter';
import { QIntroNew } from './QIntro';
import { AnswerInfo } from './AnswerInfo';
import { Modal } from '../util/modal';

export interface IFormikQuestionState {
  answersIds: string[];
  answer: any;
  questionnaireTitle: string;
}
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
  const [selectedAnswer, setSelectedAnswer] = useState<IAnswer>();
  const [aAddInfo, setAAddInfo] = useState<string>();

  const [state, dispatch] = useQuestions();
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [answersIds, setAnswersIds] = useState<string[]>([]);
  const [questionnaireTitle, setquestionnaireTitle] = useState<string>('');
  const [isModalActive, setIsModalActive] = useState(false);
  const [isConfirmationModalActive, setIsConfirmationModalActive] = useState(
    false,
  );

  useEffect(() => {
    // if (state.title === undefined) return;
    setquestionnaireTitle((_) => {
      const res = state.title !== undefined ? state.title : '';
      return res;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (state.questions === undefined) return;
    if (state.questions.length - 1 < qid) return;
    setTitle(state.questions[qid].default[1][1]);
    setQInfo(createLinks(state.questions[qid].default[1][3]));
    setQuestion(state.questions[qid].default[1][4]);
    setQAddInfo(createLinks(state.questions[qid].default[1][5]));

    const q = state.questions[qid].default;
    const localAnswers: IAnswer[] = [];

    for (let i = 1; i < q.length; i++) {
      if (q[i][6] === null) {
        continue;
      }
      const answer: IAnswer = {
        additionalText: createLinks(q[i][7]),
        colorText: q[i][9],
        text: q[i][6],
        id: `${qid}-a${i - 1}-w${q[1][0]}-p${q[i][10]}`,
        weight: q[1][0],
        possibility: q[i][10],
        qType: q[i][11] !== null ? q[i][11].toLowerCase() : undefined,
        reportAddInfo: createLinks(q[i][8]),
      };

      localAnswers.push(answer);
    }
    setCurAnswers(localAnswers);
    setAAddInfo(undefined);
    setFormReadyToRender(true);
    return () => {
      resetStates();
    };
  }, [state.questions, qid, state.answers]);

  useEffect(() => {
    if (curAnswers.length === 0) return;
    for (const item of curAnswers) {
      if (state.answers.includes(item.id) === true) {
        setAnswersIds([item.id]);
        setAAddInfo(item.additionalText);
        setSelectedAnswer(item);
      }
    }
    return () => {
      resetStates();
    };
  }, [state.answers, curAnswers]);

  const resetStates = () => {
    setSelectedAnswer(undefined);
    setAAddInfo(undefined);
    setAnswersIds([]);
  };

  const handleModalCancelClick: ClickFunction = (e) => {
    setIsConfirmationModalActive(false);
  };
  const handleModalConfirmClick: (
    event?: React.ChangeEvent<any>,
    resetForm?: (
      nextState?: Partial<FormikState<IFormikQuestionState>> | undefined,
    ) => void,
  ) => void = (_e, resetForm) => {
    dispatch({ type: 'REMOVE_ANSWERS' });
    resetStates();
    resetForm?.();
    setIsConfirmationModalActive(false);
  };
  const handleModalClick: (event: React.ChangeEvent<any>) => void = (
    e: React.ChangeEvent<any>,
  ) => {
    e.preventDefault();
    setIsModalActive((prev) => !prev);
  };

  const answerDispatch = (
    values: IFormikQuestionState,
    resetForm: (
      nextState?: Partial<FormikState<IFormikQuestionState>> | undefined,
    ) => void,
  ) => {
    if (values.answersIds.length > 0) {
      const answerQid = values.answersIds[0].split('-')[0];
      if (parseInt(answerQid, 10) === qid) {
        dispatch({
          type: 'SET_ANSWER',
          payload: {
            index: qid,
            answer:
              values.answersIds[0] === undefined ? null : values.answersIds[0],
          },
        });
        resetForm();
      }
    }
  };

  return (
    <>
      <div
        className={`modal ${isModalActive ? 'is-active' : ''}`}
        onClick={handleModalClick}
      >
        <div className='modal-background'></div>
        <div className='modal-content' onClick={handleModalClick}>
          <button
            onClick={handleModalClick}
            className='modal-close is-large'
            aria-label='close'
          ></button>
          <div className='box' onClick={handleModalClick}>
            <QIntroNew isModal={true} />
          </div>
        </div>
      </div>
      {formReadyToRender === true && (
        <Formik
          initialValues={
            {
              answersIds: answersIds,
              answer: undefined,
              questionnaireTitle: questionnaireTitle,
            } as IFormikQuestionState
          }
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // console.log('submitted', values);
            dispatch({
              type: 'SET_TITLE',
              payload: { title: values.questionnaireTitle },
            });
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
            // setAAddInfo(undefined);
            setSubmitting(false);
            resetForm();
          }}
        >
          {({ values, isSubmitting, handleChange, resetForm }) => {
            return (
              <>
                {isConfirmationModalActive && (
                  <Modal
                    isActive={isConfirmationModalActive}
                    handleConfirmClick={(e) => {
                      handleModalConfirmClick(e, resetForm);
                    }}
                    handleCancelClick={handleModalCancelClick}
                  ></Modal>
                )}
                <Form>
                  <Container>
                    <QToolBar
                      isSubmitting={isSubmitting}
                      handleInfoClick={(e: React.ChangeEvent<any>) => {
                        // calls info button
                        // console.log(e.currentTarget.id);
                        handleModalClick(e);
                      }}
                      handleReportClick={(e: React.ChangeEvent<any>) => {
                        answerDispatch(values, resetForm);
                        history.push(`/${RouteNames.questionnaire}/report`);
                      }}
                      handleResetClick={(e: React.ChangeEvent<any>) => {
                        setIsConfirmationModalActive(true);
                      }}
                    ></QToolBar>
                  </Container>
                  <Container containerClassName={'container__--padding-top'}>
                    <div className='buttons'>
                      <Pagination
                        pages={state.questions.length - 1}
                        currentPage={qid}
                        showNumbers={true}
                        isRounded={false}
                        isSmall={true}
                        isCentered={true}
                        onChange={(
                          _event: React.ChangeEvent<any>,
                          _page: number,
                        ) => {
                          // console.log(values.answersIds);
                          answerDispatch(values, resetForm);
                        }}
                      ></Pagination>
                    </div>
                  </Container>
                  <Container containerClassName={'container__--padding-top'}>
                    <div className='field'>
                      <div className='control'>
                        <input
                          className='input is-small'
                          type='text'
                          placeholder='Geben Sie einen Title ein'
                          name='title'
                          value={questionnaireTitle}
                          onChange={(e: React.ChangeEvent<any>) => {
                            handleChange(e);
                            setquestionnaireTitle(e.currentTarget.value);
                            dispatch({
                              type: 'SET_TITLE',
                              payload: { title: questionnaireTitle },
                            });
                          }}
                        />
                      </div>
                    </div>
                    {/* <SpotEditorInput
                      type='text'
                      name='questionnaireTitle'
                      label='Titel'
                    ></SpotEditorInput> */}
                  </Container>
                  <div className='hero'>
                    <div className='hero-body'>
                      <Container>
                        <h1 className='is-title'>{title}</h1>
                        <h2 className='is-subtitle'>{question}</h2>
                        <div className='content'>
                          <p
                            className={'has-text-weight-medium is-size-5'}
                            id='qInfo'
                            dangerouslySetInnerHTML={{ __html: qInfo }}
                          />
                        </div>
                        <div className='content'>
                          <p
                            className={'is-italic'}
                            id='qAddInfo'
                            dangerouslySetInnerHTML={{ __html: qAddInfo }}
                          />
                        </div>
                      </Container>
                    </div>
                  </div>
                  <Container>
                    <div className='content'>
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
                                          setSelectedAnswer(ele);
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
                                        {ele.text}
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

                    {
                      <AnswerInfo
                        selectedAnswer={selectedAnswer}
                        formikValues={values}
                        aAddInfo={aAddInfo}
                      />
                    }
                  </Container>
                  <div style={{ paddingTop: '2rem' }}>
                    <br />
                  </div>
                  <Container>
                    <Pagination
                      showNumbers={false}
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
                        answerDispatch(values, resetForm);
                      }}
                    ></Pagination>
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
