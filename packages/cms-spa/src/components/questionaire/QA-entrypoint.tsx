import React from 'react';
import { QuestionsProvider } from '../../contexts/questionaire';
import { RouteComponentProps } from 'react-router';
import { QuestionReportSwitch } from './QuestionReportSwitch';
export const QA: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const id = match.params.id;
  const numId = parseInt(id, 10);
  return (
    <QuestionsProvider>
      <QuestionReportSwitch
        numId={numId}
        matchId={match.params.id}
      ></QuestionReportSwitch>
    </QuestionsProvider>
  );
};
