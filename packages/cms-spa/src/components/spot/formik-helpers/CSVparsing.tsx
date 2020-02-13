import React from 'react';
import Papa from 'papaparse';
import { SpotEditorToClipboard } from '../elements/SpotEditor-ToClipboard';

export const NewCSVparsing: React.FC<{
  papaParseValidationRef: React.RefObject<HTMLTableElement>;
  parsingErrors: Papa.ParseError[];
}> = ({ papaParseValidationRef, parsingErrors }) => {
  return (
    <>
      <h3>CSV Struktur Report</h3>
      <SpotEditorToClipboard
        buttonId={'csv-structure-clip'}
        csvValidationRef={papaParseValidationRef}
      />
      <table className='table' ref={papaParseValidationRef}>
        <thead>
          <tr>
            <th>{'Fehler Nummer'}</th>
            <th>{'Zeile'}</th>
            <th>{'Beschreibung'}</th>
            <th>{'Fehler Code'}</th>
            <th>{'Type'}</th>
          </tr>
        </thead>
        <tbody>
          {parsingErrors.map((err, i) => {
            return (
              <tr key={i}>
                <td>{i}</td>
                <td>{err.row + 1}</td>
                <td>{err.message}</td>
                <td>{err.code}</td>
                <td>{err.type}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export function CSVparsing(
  papaParseValidationRef: React.RefObject<HTMLTableElement>,
  parsingErrors: Papa.ParseError[],
): any {
  if (process.env.NODE_ENV === 'development') {
    console.warn('This function ‚CSVparsing is DEPRECATED'); // eslint-disable-line
  }
  return (
    <div className=''>
      <h3>CSV Struktur Report</h3>
      <SpotEditorToClipboard
        buttonId={'csv-structure-clip'}
        csvValidationRef={papaParseValidationRef}
      />
      <table className='table' ref={papaParseValidationRef}>
        <thead>
          <tr>
            <th>{'Fehler Nummer'}</th>
            <th>{'Zeile'}</th>
            <th>{'Beschreibung'}</th>
            <th>{'Fehler Code'}</th>
            <th>{'Type'}</th>
          </tr>
        </thead>
        <tbody>
          {parsingErrors.map((err, i) => {
            return (
              <tr key={i}>
                <td>{i}</td>
                <td>{err.row + 1}</td>
                <td>{err.message}</td>
                <td>{err.code}</td>
                <td>{err.type}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
