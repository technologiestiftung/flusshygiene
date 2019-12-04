import React from 'react';
import { ICSVValidationErrorRes } from '../../../lib/common/interfaces';
import { SpotEditorToClipboard } from '../SpotEditor-ToClipboard';

export function CSVvalidation(
  csvValidationRef: React.RefObject<HTMLTableElement>,
  csvValidationErrors: ICSVValidationErrorRes[],
): any {
  return (
    <>
      <h3>CSV Daten Report</h3>
      <SpotEditorToClipboard
        buttonId={'csv-data-clip'}
        csvValidationRef={csvValidationRef}
      />
      <table className='table' ref={csvValidationRef}>
        <thead>
          <tr>
            <th>{'Fehler Nummer'}</th>
            <th>{'In Zeile'}</th>
            <th>{'Beschreibung'}</th>
          </tr>
        </thead>
        <tbody>
          {csvValidationErrors.map((ele, i) => {
            return (
              <tr key={i}>
                <td>{i}</td>
                <td>{ele.row}</td>
                <td>{ele.message}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
