import React from "react";
import { FormikState } from "formik";
import { IFormikQuestionState } from "../questionaire/Question";
export const Modal: React.FC<{
  handleConfirmClick: (
    event?: React.ChangeEvent<any>,
    resetForm?: (
      nextState?: Partial<FormikState<IFormikQuestionState>> | undefined,
    ) => void,
  ) => void;
  handleCancelClick: () => void;
  isActive: boolean;
}> = ({ handleCancelClick, handleConfirmClick, isActive }) => (
  <>
    <div className={isActive ? "modal is-active" : "modal"}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <h3 className="is-title is-3">Daten löschen</h3>
          <p className="is-subtitle">
            Sind Sie sicher, dass sie diese Daten löschen wollen?
          </p>
          <div className="content">
            <p className="is-small">
              <em>(Dieser Vorgang kann nicht rückgängig gemacht werden)</em>
            </p>
            <div className="buttons">
              <button
                onClick={handleCancelClick}
                aria-label="close"
                className="modal-close"
              ></button>
              <button onClick={handleCancelClick} className="button is-small">
                {" "}
                Ups. Besser nicht.
              </button>
              <button
                onClick={handleConfirmClick}
                className="button is-small is-danger"
              >
                Ja sicher!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
