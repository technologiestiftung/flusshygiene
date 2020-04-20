import React from "react";
import { IconThumbsUp, IconBug } from "../../fontawesome-icons";
export const DataValidationInfoBox: React.FC<{
  dataIsValid: boolean | undefined;
  title: string;
  unboxed?: boolean;
}> = ({ dataIsValid, title, unboxed }) => {
  return (
    <div className={`${unboxed === true ? "" : "box box__info"}`}>
      <div className="content">
        <p>
          {(() => {
            if (dataIsValid === true) {
              return (
                <>
                  <span>
                    <IconThumbsUp></IconThumbsUp>
                  </span>{" "}
                  <strong>
                    {title}: Alle Daten sind valide und bereit für den Upload
                  </strong>
                </>
              );
            } else if (dataIsValid === false) {
              return (
                <>
                  <span>
                    <IconBug></IconBug>
                  </span>{" "}
                  <strong>
                    {title}: Fehler in ihren Daten. Bitte überprüfen sie diese
                    nochmals.
                  </strong>
                </>
              );
            } else {
              return <span>Laden Sie ihre Daten hier hoch</span>;
            }
          })()}
        </p>
      </div>
    </div>
  );
};
