import React from 'react';
import { IconThumbsUp, IconBug } from '../fontawesome-icons';
export function DataValidationInfoBox(
  dataIsValid: boolean | undefined,
): React.ReactNode {
  return (
    <div className='box box__info'>
      <div className='content'>
        <p>
          {(() => {
            if (dataIsValid === true) {
              return (
                <>
                  <span>
                    <IconThumbsUp></IconThumbsUp>
                  </span>{' '}
                  <strong>
                    Alle Daten sind valide und bereit für den Upload
                  </strong>
                </>
              );
            } else if (dataIsValid === false) {
              return (
                <>
                  <span>
                    <IconBug></IconBug>
                  </span>{' '}
                  <strong>
                    Fehler in ihren Daten. Bitte überprüfen sie diese nochmals.
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
}
