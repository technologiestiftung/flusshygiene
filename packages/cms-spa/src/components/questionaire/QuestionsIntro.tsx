import React from "react";
import { QIntroNew } from "./QIntro";
//import { QuestionsProvider } from '../../contexts/questionaire';

export const QuestionsIntro: React.FC = () => {
  return (
    <>
      <QIntroNew isModal={false} />
    </>
  );
};
