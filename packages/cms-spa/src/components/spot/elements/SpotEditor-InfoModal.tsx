import React from "react";
import { HelpText } from "../../HelpText";

export const SpotEditorInfoModal: React.FC<{
  isActive: boolean;
  clickHandler: (e?: React.ChangeEvent<any>) => void;
}> = ({ isActive, clickHandler }) => {
  return (
    <div className={`modal ${isActive === true ? "is-active" : ""}`}>
      <div className="modal-background" onClick={clickHandler}></div>
      <div className="modal-content">
        <div className="box">
          <HelpText />
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={clickHandler}
        ></button>
      </div>
    </div>
  );
};
