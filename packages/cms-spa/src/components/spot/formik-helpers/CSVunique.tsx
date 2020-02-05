import React from 'react';
import { MeasurementTypes } from '../../../lib/common/interfaces';

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
const h = d.getHours();
const m = d.getMinutes();
const s = d.getSeconds();
const getDate = (incr: number) =>
  `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')} ${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${((s + incr) % 60).toString().padStart(2, '0')}`;
export const CSVUnique: React.FC<{ type: MeasurementTypes }> = ({ type }) => {
  return (
    <>
      <h3>CSV Einzigartige Werte Report</h3>
      <div className='content'>
        <p>
          In Ihrem CSV sind Duplikate enthalten. Für die Zeile{' '}
          <code>"date"</code> (YYY-MM-DD) dürfen nur eintigeartige Daten
          eingetragen sein. Falls sie mehrere Messwerte pro Tag angeben möchten
          müssen Sie einen Zeitstempel im Format HH:MM:SS enthalten sein. Zum
          Beispiel:
        </p>
        <table className='table'>
          <thead>
            <tr>
              <th>{'date'}</th>
              {type === 'measurements' ? (
                <>
                  <th>{'conc_ec'}</th>
                  <th>{'conc_ie'}</th>
                </>
              ) : (
                <th>{'value'}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((incr) => {
              return (
                <tr key={incr}>
                  <td>{getDate(incr)}</td>
                  {type === 'measurements' ? (
                    <>
                      <td>{Math.floor(Math.random() * 1000)}</td>
                      <td>{Math.floor(Math.random() * 1000)}</td>
                    </>
                  ) : (
                    <td>{Math.floor(Math.random() * 1000)}</td>
                  )}
                </tr>
              );
            })}
            {/* <tr>
              <td>{getDate(0)}</td>
              {type === 'measurements' ? (
                <>
                  <td>{Math.floor(Math.random() * 1000)}</td>
                  <td>{Math.floor(Math.random() * 1000)}</td>
                </>
              ) : (
                <td>{Math.floor(Math.random() * 1000)}</td>
              )}
            </tr> */}
          </tbody>
        </table>
      </div>
    </>
  );
};
