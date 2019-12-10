import React, { useState, useEffect } from 'react';
import { useQuestions } from '../../contexts/questionaire';
import { Container } from '../Container';
import { Link, Redirect } from 'react-router-dom';
import { RouteNames } from '../../lib/common/enums';
import {
  IconLink,
  colorNameToIcon,
  questionTypeToIcon,
  IconPDF,
  IconCode,
} from '../fontawesome-icons';
import { IAnswer } from '../../lib/common/interfaces';
import { createLinks } from '../../lib/utils/questionnaire-additional-texts-filter';
import { ButtonIcon as Button } from '../Buttons';

import FileSaver from 'file-saver';
import { roundToFloatDigits } from '../../lib/utils/formatting-helpers';

/**
 * @todo missing links in footnote @Urs
 */
export const Report: React.FC = () => {
  const [state] = useQuestions();
  const [localQuestions, setLocalQuestions] = useState<string[]>([]);
  const [localQuestionsAddInfo, setlocalQuestionsAddInfo] = useState<string[]>(
    [],
  );
  const [localAnswers, setLocalAnswers] = useState<IAnswer[][]>([]);
  const [probability, setProbability] = useState(0);
  const [allAnswersGiven, setAllAnswersGiven] = useState(false);
  const [pdfReportAnswers, setPdfReportAnswers] = useState<Array<IAnswer>>([]);
  useEffect(() => {
    if (state.questions === undefined) return;
    if (state.questions[0] === undefined) return;
    const tmpQuestions: string[] = [];
    const tmpQuestionsAddInfo: string[] = [];
    const tmpAnswers: IAnswer[][] = [];
    const tmpPDFReportAnswers: IAnswer[] = [];
    for (let i = 1; i < state.questions.length; i++) {
      tmpQuestions.push(state.questions[i].default[1][4]);
      tmpQuestionsAddInfo.push(createLinks(state.questions[i].default[1][5]));
      const answers: IAnswer[] = [];
      // const reportAnswer: Array<IAnswer> = [];
      for (let j = 1; j < state.questions[i].default.length; j++) {
        const q = state.questions[i].default[j];

        const text: string = q[6];

        if (text === null) {
          continue;
        }
        const answer: IAnswer = {
          text,
          additionalText: createLinks(q[7]),
          colorText: q[9],
          id: `${i}-a${j - 1}-w${state.questions[i].default[1][0]}-p${q[10]}`,
          weight: state.questions[i].default[1][0],
          possibility: q[10],
          qType: q[11] !== null ? q[11].toLowerCase() : undefined,
          reportAddInfo: createLinks(q[8]),
        };
        answers.push(answer);
        if (state.answers.includes(answer.id) === true) {
          tmpPDFReportAnswers.push(answer);
        }
        // } else {
        // reportAnswer.push(null);
        // }
      }
      tmpAnswers.push(answers);
      // tmpPDFReportAnswers.push(reportAnswer);
    }
    // console.log(tmpAnswers);
    setlocalQuestionsAddInfo((_) => tmpQuestionsAddInfo);
    setLocalQuestions((_) => tmpQuestions);
    setLocalAnswers((_) => tmpAnswers);
    setPdfReportAnswers((_) => tmpPDFReportAnswers);
  }, [state.questions, setLocalQuestions, state.answers]);

  useEffect(() => {
    if (state.answers === undefined) return;
    if (state.answers.length === 0) return;

    const answers = state.answers.filter((ele) => ele !== undefined);
    // console.log('A', state.answers.length, 'Q', state.questions.length);
    console.log(answers);
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
      if (item === null) continue;
      if (typeof item !== 'string') continue;

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

  if (state.questions.length === 0) {
    return <Redirect to={`/${RouteNames.questionnaire}`} />;
  } else {
    return (
      <>
        <Container columnClassName={'is-8'}>
          <div className='buttons'>
            <Link
              className='button is-small'
              to={{
                pathname: `/${RouteNames.questionnaire}-pdfviewer`,
                state: {
                  questions: localQuestions,
                  answers: pdfReportAnswers,
                  addInfoQuestion: localQuestionsAddInfo,
                  title: `Standortbewertung-${state.title}`,
                  probability: `Umsetzungswahrscheinlichkeit: ${isNaN(
                    probability,
                  ) === false && roundToFloatDigits(probability, 0)}%`,
                  allAnswersGiven: allAnswersGiven,
                },
              }}
            >
              <span className='icon is-small'>
                {' '}
                <IconPDF />
              </span>{' '}
              <span>PDF</span>
            </Link>
            <Button
              text={'JSON'}
              handleClick={(e: React.ChangeEvent<any>) => {
                console.log('JSON');
                const blob = new Blob(
                  [
                    JSON.stringify({
                      contextState: state,
                      answers: localAnswers,
                      questions: localQuestions,
                    }),
                  ],
                  {
                    type: 'text/plain;charset=utf-8',
                  },
                );
                FileSaver.saveAs(blob, `standortbewertung-${state.title}.json`);
                console.log(state.answers);
              }}
            >
              <IconCode />
            </Button>
          </div>
        </Container>
        <Container columnClassName={'is-8'}>
          <h1 className='title is-1'>Report</h1>
          <h2 className='subtitle is-4'>der aktuellen Standortbewertung</h2>
          <div className='content'>
            <p>
              Mit der Beantwortung der Fragen zur Einschätzung über die Eignung
              eines neuen Badegewässerstandortes haben Sie einen wichtigen
              Schritt in Richtung neuer Badestelle unternommen. Glückwunsch!
            </p>
            <p>
              Sie haben nun eine Übersicht über verschiedene wichtige Kriterien
              ihres anvisierten Standortes und voraussichtlich auch erste
              konkrete weitere Ansatzpunkte, um durch Recherchen und Gespräche
              noch bestehende Wissenslücken zu schließen. Außerdem gibt ihnen
              die ermittelte Umsetzungswahrscheinlichkeit eine Einschätzung der
              Erfolgsaussichten. Damit aus der vorgenommen Ersteinschätzung und
              der dahinterstehenden Idee eines neuen Badegewässers jedoch
              Wirklichkeit werden kann, ist noch einiges zu tun. Was dies in
              Ihrem Fall ist zeigt Ihnen das folgende Reporting:
            </p>
          </div>
          {state.title !== undefined && state.title.length > 0 && (
            <h3 className={'subtitle is 6'}>{state.title}</h3>
          )}
          <div className='content'>
            {allAnswersGiven === true && (
              <p>
                <strong>
                  Achtung es wurden nicht alle Fragen beantwortet!
                </strong>
              </p>
            )}
            <p
              className={`subtitle ${
                allAnswersGiven === false ? 'has-text-grey-light' : ''
              }`}
            >
              Umsetzungswahrscheinlichkeit:{' '}
              {isNaN(probability) === false &&
                roundToFloatDigits(probability, 2)}
              %
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
                        if (
                          state.answers[i + 1] === undefined ||
                          state.answers[i + 1] === null
                        ) {
                          return (
                            <p>
                              <em>Noch nicht beantwortet!</em>
                            </p>
                          );
                        }
                        const split = state.answers[i + 1].split('-');
                        const aId = parseInt(split[1].substring(1), 10);

                        return (
                          <>
                            <p>
                              <strong>Ihre Antwort: </strong>{' '}
                              {localAnswers[i][aId].text}{' '}
                            </p>
                            <p>
                              <span>
                                {colorNameToIcon(
                                  localAnswers[i][aId].colorText,
                                )}{' '}
                                {localAnswers[i][aId].qType !== undefined &&
                                  questionTypeToIcon(
                                    localAnswers[i][aId].qType!,
                                    localAnswers[i][aId].colorText,
                                  )}
                              </span>{' '}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: localAnswers[i][aId].reportAddInfo,
                                }}
                              />
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className='content'>
            <p>
              Unabhängig von den von ihnen gegeben Antworten und den hieraus
              resultierenden Arbeitsanregungen, ist das Verfassen einer
              Projektskizze ein wesentlicher erster Schritt, um die Idee eines
              neuen Badegewässers zu konkretisieren und für andere anschaulich
              zu machen. Hierbei kann der Leitfaden:{' '}
              <em>
                Eröffnung neuer Flussbadestellen – Praxisleitfaden am Beispiel
                der Berliner Vorstadtspree
              </em>
              <sup>
                <a href='#footnote-1' id='footnote-ref-1'>
                  [1]
                </a>
              </sup>
              , hervorgegangen aus dem BMBF Forschungsprojekt FLUSSHYGIENE, eine
              gute Hilfestellung bieten.{' '}
            </p>
            <p>
              Neben der Erstellung einer Projektskizze, sollte möglichst
              frühzeitig, Kontakt mit den Flächeneigentümer_innen aufgenommen
              werden, die Einbindung einer Badestelle in vorhandene
              Planungswerke (Landschaftsprogramme, Stadtentwicklungskonzepte,
              Gewässerentwicklungskonzepte Tourismuskonzepte, Sportkonzepte,
              Bäderkonzepte u.a.) geprüft werden und wenn nötig, die Suche nach
              politischer Unterstützung begonnen werden.
            </p>
            <p>
              Darüber hinaus liefert das kurze{' '}
              <em>Merkblatt zur Einrichtung neuer Flussbadegewässer </em>einen
              bündigen Überblick über die wesentlichen Themen und Schritte hin
              zur Einrichtung eines Badegewässers.
              <sup>
                <a href='#footnote-2' id='footnote-ref-2'>
                  [2]
                </a>
              </sup>{' '}
            </p>
            <p>
              Um eine Vorstellung von der Anwendung des Merkblattes zu bekommen
              wurde dieses beispielhaft auf einen Standort an der Berliner Spree
              angewandt. Das Ergebnis, die{' '}
              <em>
                Anwendung des Merkblattes zur Einrichtung neuer
                Flussbadegewässer - Anwendungsbeispiel Insel der Jugend Berlin
                <sup>
                  <a href='#footnote-3' id='footnote-ref-3'>
                    [3]
                  </a>
                </sup>
                ,{' '}
              </em>
              kann als Anregung dienen.{' '}
            </p>
            <p>
              Wir wünschen ihnen viel Erfolg bei der Initiierung eines neuen
              Badegewässers!
            </p>
            <ol>
              <li id='footnote-1'>
                <p>
                  {' '}
                  Raber, W., Bösche, U., Schön, S, (2018): Eröffnung neuer
                  Flussbadestellen – Praxisleitfaden am Beispiel der Berliner
                  Vorstadtspree, BMBF Forschungsprojekt FLUSSHYGIENE
                  <a href='https://www.inter3.de/fileadmin/user_upload/Downloads/Flyer_usw/Praxisleitfaden_Eroeffnung_neuer_Flussbadestellen-Januar_2019.pdf'>
                    <IconPDF />
                    <span> </span>Praxisleitfaden Eröffnung neuer
                    Flussbadestellen
                  </a>{' '}
                  <a href='#footnote-ref-1'>↑</a>
                </p>
              </li>
              <li id='footnote-2'>
                <p>
                  {' '}
                  Raber, W., Bösche, U., Selinka, H.-C., Szewzyk, R. (Hrsg.)
                  (2018): Merkblatt zur Einrichtung neuer Flussbadegewässer,
                  BMBF-Forschungsprojekt FLUSSHYGIENE {/*(LINK)*/}{' '}
                  <a href='#footnote-ref-2'>↑</a>
                </p>
              </li>
              <li id='footnote-3'>
                <p>
                  {' '}
                  Raber, W., Bösche, U., Seis, W. (Hrsg.) (2019): Anwendung des
                  Merkblattes zur Einrichtung neuer Flussbadegewässer:
                  Anwendungsbeispiel Insel der Jugend Berlin,
                  BMBF-Forschungsprojekt FLUSSHYGIENE {/*(LINK)*/}{' '}
                  <a href='#footnote-ref-3'>↑</a>
                </p>
              </li>
            </ol>
          </div>
        </Container>
      </>
    );
  }
};
