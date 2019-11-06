import React from 'react';
import { useQuestions } from '../../contexts/questionaire';
import { Redirect } from 'react-router';
import { Question } from './Question';
import { RouteNames } from '../../lib/common/enums';
import { Report } from './QA-Report';

export const QuestionReportSwitch: React.FC<{
  numId: number;
  matchId: string;
}> = ({ numId, matchId }) => {
  const [state] = useQuestions();
  if (isNaN(numId) === false && numId > 0 && numId < state.questions.length) {
    return <Question qid={parseInt(matchId, 10)} />;
  } else if (matchId === 'report') {
    return <Report />;
  } else {
    return (
      <>
        <h1>Ups…</h1>
        <div className='content'>
          <p>
            Sie sollten nicht hier landen… Ich schicke Sie zurück zum Anfang der
            Standortbewertung
          </p>
        </div>
        <Redirect to={`/${RouteNames.questionnaire}`} />
      </>
    );
  }
};
