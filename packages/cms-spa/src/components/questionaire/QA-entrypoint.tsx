import React from 'react';
import { QuestionsProvider } from '../../contexts/questionaire';
import { RouteComponentProps } from 'react-router';
import { QuestionReportSwitch } from './QuestionReportSwitch';
import history from '../../lib/history';
import { RouteNames } from '../../lib/common/enums';
export const QA: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const id = match.params.id;
  const numId = parseInt(id, 10);
  if (isNaN(numId) === true) {
    const err = new Error('Could not parse number from questions id');
    console.error(err);
  }
  if (numId === 0) {
    history.push(`/${RouteNames.questionnaire}/1`);
    const err = new Error('We should never reach the question 0');
    console.error(err);
  }
  return (
    <QuestionsProvider>
      <QuestionReportSwitch
        numId={numId}
        matchId={match.params.id}
      ></QuestionReportSwitch>
    </QuestionsProvider>
  );
};
