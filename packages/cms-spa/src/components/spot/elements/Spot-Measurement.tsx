import React from "react";
import {
  IObject,
  IBathingspotMeasurement,
} from "../../../lib/common/interfaces";
import { hasAutoData } from "../../../lib/utils/has-autodata-url";

const kA = "k. A.";
export interface ISpotMeasurement {
  measurements: IObject[];
  hasPrediction?: boolean;
  children?: React.ReactNode;
  hasAutoData?: boolean;
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
  hasAutoData?: boolean;
}

const sortIObjectByDate = (a: IObject, b: IObject) => {
  return (
    ((new Date(a.date) as unknown) as number) -
    ((new Date(b.date) as unknown) as number)
  );
};

export const Measurement: React.FC<ISpotMeasurement> = (props) => {
  const sortedMeasurement = props.measurements.sort(sortIObjectByDate);

  let lastMeasurment: IBathingspotMeasurement =
    sortedMeasurement[sortedMeasurement.length - 1];
  for (const key in lastMeasurment) {
    if (lastMeasurment[key] === null) {
      lastMeasurment[key] = undefined;
    }
  }
  const emptyMeasurment: IBathingspotMeasurement = {};
  lastMeasurment =
    lastMeasurment !== undefined ? lastMeasurment : emptyMeasurment;
  return (
    <>
      <MeasurementTable
        measurements={sortedMeasurement}
        hasAutoData={props.hasAutoData}
      />
      {props.children}
    </>
  );
};

export const MeasurementTableRow = (props: IMeasurementableRow) => (
  <tr>
    <th>{props.rowKey}</th>
    <td>{props.rowValue}</td>
  </tr>
);

export const MeasurementTable = (props: IMeasurementable) => {
  const sortedMeasurement = props.measurements.sort(sortIObjectByDate);
  let lastMeasurment: IBathingspotMeasurement =
    sortedMeasurement[sortedMeasurement.length - 1];
  const emptyMeasurment: IBathingspotMeasurement = {};
  lastMeasurment =
    lastMeasurment !== undefined ? lastMeasurment : emptyMeasurment;
  const dateOpts = {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  };
  return (
    <table className="table bathingspot__measurement-table">
      <tbody>
        {/* <MeasurementTableRow
          rowKey={'Anzahl Datensätze'}
          rowValue={`${sortedMeasurement.length}`}
        ></MeasurementTableRow> */}

        <MeasurementTableRow
          rowKey="Datum"
          rowValue={
            lastMeasurment.date !== undefined
              ? new Date(lastMeasurment.date).toLocaleDateString(
                  "de-DE",
                  dateOpts,
                )
              : kA
          }
        />

        {/* {
          <MeasurementTableRow
            rowKey='Wasserqualität'
            rowValue={
              lastMeasurment.wasserqualitaetTxt !== undefined
                ? `${lastMeasurment.wasserqualitaetTxt}`
                : kA
            }
          />
        } */}
        {
          <MeasurementTableRow
            rowKey="Sichttiefe"
            rowValue={
              lastMeasurment.sichtTxt !== undefined
                ? `${lastMeasurment.sichtTxt} cm`
                : kA
            }
          />
        }
        {
          <MeasurementTableRow
            rowKey="Escherichia coli"
            rowValue={
              lastMeasurment.conc_ec !== undefined
                ? `${lastMeasurment.conc_ec} pro 100 ml`
                : kA
            }
          />
        }
        {
          <MeasurementTableRow
            rowKey="Intestinale Enterokokken"
            rowValue={
              lastMeasurment.conc_ie !== undefined
                ? `${lastMeasurment.conc_ie} pro 100 ml`
                : kA
            }
          />
        }
        {
          <MeasurementTableRow
            rowKey="Wassertemperatur"
            rowValue={
              lastMeasurment.tempTxt !== undefined
                ? `${lastMeasurment.tempTxt.replace(".", ",")} ℃`
                : kA
            }
          />
        }
        {
          <MeasurementTableRow
            rowKey="Coliforme Bakterien"
            rowValue={
              lastMeasurment.cb !== undefined
                ? `${lastMeasurment.cb} pro 100 ml`
                : kA
            }
          />
        }
        {
          <MeasurementTableRow
            rowKey="Automatisiert"
            rowValue={hasAutoData(
              props.hasAutoData !== undefined,
              undefined,
              true,
            )}
          />
        }
      </tbody>
    </table>
  );
};
