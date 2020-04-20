import React from "react";
import { ICSVValidationErrorRes } from "../../../lib/common/interfaces";
import { SpotEditorToClipboard } from "../elements/SpotEditor-ToClipboard";

export const NewCSVValidation: React.FC<{
  csvValidationRef: React.RefObject<HTMLTableElement>;
  csvValidationErrors: ICSVValidationErrorRes[];
}> = ({ csvValidationErrors, csvValidationRef }) => {
  return (
    <>
      <h3>CSV Daten Report</h3>
      <SpotEditorToClipboard
        buttonId={"csv-data-clip"}
        csvValidationRef={csvValidationRef}
      />
      <table className="table" ref={csvValidationRef}>
        <thead>
          <tr>
            <th>{"Fehler Nummer"}</th>
            <th>{"In Zeile"}</th>
            <th>{"Beschreibung"}</th>
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
};
export function CSVvalidation(
  csvValidationRef: React.RefObject<HTMLTableElement>,
  csvValidationErrors: ICSVValidationErrorRes[],
): any {
  if (process.env.NODE_ENV === "development") {
    console.warn("This function CSVvalidation is DEPRECATED"); // eslint-disable-line
  }
  return (
    <>
      <h3>CSV Daten Report</h3>
      <SpotEditorToClipboard
        buttonId={"csv-data-clip"}
        csvValidationRef={csvValidationRef}
      />
      <table className="table" ref={csvValidationRef}>
        <thead>
          <tr>
            <th>{"Fehler Nummer"}</th>
            <th>{"In Zeile"}</th>
            <th>{"Beschreibung"}</th>
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
