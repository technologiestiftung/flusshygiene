import React from 'react';

export const SpotEditorMeasurmentInfo: React.FC = () => {
  return (
    <div className='content'>
      {/* <h2>Dateineingabe</h2> */}
      <p>
        Die Dateneingabe muss über eine CSV.-Datei (Comma Seperated Value)
        erfolgen, dass wiederum einem bestimmten Format genügen muss, um von der
        Plattform eingelesen werden zu können. Innerhalb der Plattform werden
        die folgenden Trennzeichen verwendet:
      </p>
      <div className='columns'>
        <div className='column is-5'>
          <table className='table is-narrow'>
            <thead>
              <tr>
                <th>Art des Trennzeichens</th>
                <th>Zeichen </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dezimaltrennzeichen </td>
                <td>Punkt </td>
              </tr>
              <tr>
                <td>Spaltentrennzeichen</td>
                <td>Komma</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p>
        Alle Spaltennamen und Werte müssen ohne Anführungszeichen angegeben
        werden. Die Datentabelle muss des Weiteren die folgenden Spalten
        enthalten:
      </p>
      <table className='table'>
        <thead>
          <tr>
            <th>Spaltenname</th>
            <th>Information</th>
            <th>Format</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>date</td>
            <td>Datum der Probenname </td>
            <td>
              YYYY-MM-DD HH:MM:SS <br />
              (Beispiel: 2016-04-15 13:15:13 = 15. April 2006 um 13 Uhr 15 und
              15 Sekunden)
            </td>
          </tr>
          <tr>
            <td>conc_ec</td>
            <td>Messwert von E.coli [MPN/100mL]</td>
            <td>Ganze Zahlen, keine Dezimalstellen</td>
          </tr>
          <tr>
            <td>conc_ie</td>
            <td>Messwert von intestinalen Enterokokken [MPN/100mL]</td>
            <td>Ganze Zahlen, keine Dezimalstellen</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
