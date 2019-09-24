import React, { useState, useEffect } from 'react';
import { useQuestions } from '../../contexts/questionaire';
import { Container } from '../Container';
import { Link } from 'react-router-dom';
import { RouteNames } from '../../lib/common/enums';
import {
  IconLink,
  colorNameToIcon,
  questionTypeToIcon,
} from '../fontawesome-icons';
import { IAnswer } from '../../lib/common/interfaces';
import { roundTo } from '../../lib/utils/round-to-float-digits';
export const Report: React.FC = () => {
  const [state] = useQuestions();
  const [localQuestions, setLocalQuestions] = useState<string[]>([]);
  const [localAnswers, setLocalAnswers] = useState<IAnswer[][]>([]);
  const [probability, setProbability] = useState(0);
  const [allAnswersGiven, setAllAnswersGiven] = useState(false);
  useEffect(() => {
    if (state.questions === undefined) return;
    if (state.questions[0] === undefined) return;
    const tmpQuestions: string[] = [];
    const tmpAnswers: IAnswer[][] = [];
    for (let i = 1; i < state.questions.length; i++) {
      tmpQuestions.push(state.questions[i].default[1][4]);
      const answers: IAnswer[] = [];
      for (let j = 1; j < state.questions[i].default.length; j++) {
        const q = state.questions[i].default[j];

        const text: string = q[6];

        if (text === null) {
          continue;
        }
        const answer: IAnswer = {
          text,
          additionalText: q[7],
          colorText: q[9],
          id: `${i}-a${j - 1}-w${state.questions[i].default[1][0]}-p${q[10]}`,
          weight: state.questions[i].default[1][0],
          possibility: q[10],
          qType: q[11] !== null ? q[11].toLowerCase() : undefined,
        };
        answers.push(answer);
      }
      tmpAnswers.push(answers);
    }
    // console.log(tmpAnswers);
    setLocalQuestions((_) => {
      return tmpQuestions;
    });
    setLocalAnswers((_) => {
      return tmpAnswers;
    });
  }, [state.questions]);

  useEffect(() => {
    if (state.answers === undefined) return;
    if (state.answers.length === 0) return;

    const answers = state.answers.filter((ele) => ele !== undefined);
    // console.log('A', state.answers.length, 'Q', state.questions.length);
    // console.log(answers);
    const copyAnwers = [...state.answers];
    copyAnwers.shift();
    if (copyAnwers.includes(undefined) === false) {
      setAllAnswersGiven(true);
    }
    if (answers.length === 0) return;

    const allAnswersWeights: number[] = [];
    const allWeights: number[] = [];
    for (const item of answers) {
      if (item === undefined) continue;
      const split = item.split('-');
      const weight = parseInt(split[2].substring(1), 10);
      const possibility = parseFloat(split[3].substring(1));
      // console.log(weight * (possibility * 100));
      allAnswersWeights.push(weight * (possibility * 100));
      allWeights.push(weight);
    }

    const sumAnswers = allAnswersWeights.reduce((a, b) => a + b, 0);
    const sumWeights = allWeights.reduce((a, b) => a + b, 0);
    const res = sumAnswers / sumWeights;
    // console.log('result of probabilty', res);
    setProbability(res);
    return () => {};
  }, [state.answers]);
  return (
    <>
      <Container columnClassName={'is-8'}>
        <h1 className='title is-1'>Report</h1>
        <h2 className='subtitle is-4'>der aktuellen Standortbewertung</h2>
        <div className='content'>
          {allAnswersGiven === false && (
            <p>
              <strong>Achtung es wurden nicht alle Fragen beantwortet!</strong>
            </p>
          )}
          <p className={allAnswersGiven === false ? 'has-text-grey-light' : ''}>
            Umsetzungswahrscheinlichkeit:{' '}
            {isNaN(probability) === false && roundTo(probability, 2)}%
          </p>
        </div>
        <div className='content'>
          <ol>
            {localQuestions.map((ele, i) => {
              return (
                <li key={i}>
                  <div className='content report__answer'>
                    <p className=''>
                      <strong>
                        {ele}{' '}
                        <Link
                          to={`/${RouteNames.questionnaire}/${i + 1}`}
                          title={'Zurück zur Frage'}
                        >
                          <IconLink />
                        </Link>
                      </strong>
                    </p>

                    {(() => {
                      if (state.answers[i + 1] === undefined) {
                        return (
                          <p>
                            <em>Noch nicht beantwortet!</em>
                          </p>
                        );
                      }
                      const split = state.answers[i + 1].split('-');
                      // const id = parseInt(split[0], 10);
                      const aId = parseInt(split[1].substring(1), 10);
                      // if (id === i + 1) {
                      //   console.log(id, aId);
                      //   console.log(localAnswers[i][aId]);
                      // }
                      // console.log(i, state.answers[i + 1]);
                      return (
                        <p>
                          {localAnswers[i][aId].text}{' '}
                          {colorNameToIcon(localAnswers[i][aId].colorText)}{' '}
                          {localAnswers[i][aId].qType !== undefined &&
                            questionTypeToIcon(
                              localAnswers[i][aId].qType!,
                              localAnswers[i][aId].colorText,
                            )}
                        </p>
                      );
                    })()}

                    {/* <p>{JSON.stringify(localAnswers[i])}</p> */}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        {/* <pre>
          <code>{JSON.stringify(state.answers, null, 2)}</code>
        </pre> */}
      </Container>
    </>
  );
};
