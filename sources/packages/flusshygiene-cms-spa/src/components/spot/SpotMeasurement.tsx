import React from 'react';
import { IObject } from '../../lib/common/interfaces';

const kA = 'k. A.';
export interface IMeasurement {
  measurements: IObject[];
  hasPrediction: boolean;
  children?: React.ReactNode;
}

export interface IMeasurementableRow {
  rowKey: string;
  rowValue: string;
}

/**
 * @property {IObject[]} measurements
 */
export interface IMeasurementable {
  measurements: IObject[];
}

const measurementSort = (a: IObject, b: IObject) => {
  return (
    ((new Date(a.date) as unknown) as number) -
    ((new Date(b.date) as unknown) as number)
  );
};

export const Measurement: React.FC<IMeasurement> = (props) => {
  const sortedMeasurment = props.measurements.sort(measurementSort);
  const lastMeasurment = sortedMeasurment[sortedMeasurment.length - 1];
  return (
    <div className='bathingspot__body-measurement'>
      <h3 className='title is-3'>
        Wasserqualität{' '}
        {(() => {
          if (props.hasPrediction === true) {
            return <span className='asteriks'>*</span>;
          }
          return null;
        })()}
      </h3>
      <figure className='image is-32x32'>
        <img src='https://via.placeholder.com/32' alt='prediction icon' />
      </figure>
      {(() => {
        const dateOpts = {
          day: 'numeric',
          month: 'long',
          weekday: 'long',
          year: 'numeric',
        };
        return (
          <div>
            <p>{`wasserqualitaet: (NOT YET PARSED TO TEXT) ${lastMeasurment.wasserqualitaetTxt}`}</p>
            <p>
              (Letzte Messung{' '}
              {new Date(lastMeasurment.date).toLocaleDateString(
                'de-DE',
                dateOpts,
              )}
              )
            </p>
          </div>
        );
      })()}
      <MeasurementTable measurements={sortedMeasurment} />

      {props.children}
    </div>
  );
};

export const MeasurementTableRow = (props: IMeasurementableRow) => (
  <tr>
    <th>{props.rowKey}</th>
    <td>{props.rowValue}</td>
  </tr>
);

export const MeasurementTable = (props: IMeasurementable) => {
  const sortedMeasurement = props.measurements.sort(measurementSort);
  const lastMeasurment = sortedMeasurement[sortedMeasurement.length - 1];

  return (
    <table className='table bathingspot__measurement-table'>
      <tbody>
        {
          <MeasurementTableRow
            rowKey='Sichttiefe'
            rowValue={
              lastMeasurment.sichtTxt !== null
                ? `${lastMeasurment.sichtTxt} cm`
                : kA
            }
          />
        }
        {
          <MeasurementTableRow
            rowKey='Escherichia coli'
            rowValue={
              lastMeasurment.conc_ec !== null
                ? `${lastMeasurment.conc_ec} pro 100 ml`
                : kA
            }
          />
        }
        {
          <MeasurementTableRow
            rowKey='Intestinale Enterokokken'
            rowValue={
              lastMeasurment.conc_ie !== null
                ? `${lastMeasurment.conc_ie} pro 100 ml`
                : kA
            }
          />
        }
        {
          <MeasurementTableRow
            rowKey='Wassertemperatur'
            rowValue={(() => {
              if (lastMeasurment.tempTxt !== null) {
                return `${lastMeasurment.tempTxt.replace('.', ',')} °C`;
              } else {
                return kA;
              }
            })()}
          />
        }
        {
          <MeasurementTableRow
            rowKey='Coliforme Bakterien'
            rowValue={
              lastMeasurment.cb !== null
                ? `${lastMeasurment.cb} pro 100 ml`
                : kA
            }
          />
        }
      </tbody>
    </table>
  );
};
