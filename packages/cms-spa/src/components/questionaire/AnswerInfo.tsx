import React from "react";
import { IAnswer } from "../../lib/common/interfaces";
import { colorNameToIcon, questionTypeToIcon } from "../fontawesome-icons";
import { IFormikQuestionState } from "./Question";
export const AnswerInfo: React.FC<{
  selectedAnswer: IAnswer | undefined;
  formikValues: IFormikQuestionState;
  aAddInfo: string | undefined;
}> = ({ selectedAnswer, formikValues, aAddInfo }) => {
  let colIcon: JSX.Element | undefined = undefined;
  let qTypeIcon: JSX.Element | undefined = undefined;
  let koMatch = false;
  if (selectedAnswer !== undefined) {
    if (formikValues.answersIds.includes(selectedAnswer.id) === true) {
      colIcon = colorNameToIcon(selectedAnswer.colorText);
    }
    if (selectedAnswer.qType !== undefined) {
      qTypeIcon = questionTypeToIcon(
        selectedAnswer.qType,
        selectedAnswer.colorText,
      );
    }
  }
  if (aAddInfo && /K\.O\./.test(aAddInfo)) {
    koMatch = true;
  }
  if (aAddInfo && koMatch === true) {
    return (
      <div className="message is-danger">
        <div className="message-header">
          <div className="content">
            <span>{colIcon}</span>
            <span> </span>
            <span>{qTypeIcon}</span>
            <span> </span>
            {"K.O.-Kriterium"}
          </div>
        </div>
        <div
          className="message-body"
          dangerouslySetInnerHTML={{
            __html:
              aAddInfo !== undefined
                ? aAddInfo.replace(/k.o.-kriterium:\s/i, "")
                : "",
          }}
        ></div>
      </div>
    );
  } else if (aAddInfo) {
    return (
      <div className="message">
        <div className="message-body is-dark">
          <p>
            <span>{colIcon}</span>
            <span> </span>
            <span>{qTypeIcon}</span>
            <span> </span>
            <span
              dangerouslySetInnerHTML={{
                __html: aAddInfo !== undefined ? aAddInfo : "",
              }}
            ></span>
          </p>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
