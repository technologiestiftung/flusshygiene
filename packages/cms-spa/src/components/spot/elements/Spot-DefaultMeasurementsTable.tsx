import React from 'react';
import { IDefaultMeasurement } from '../../../lib/common/interfaces';
import { Table, TableBody, TableRow } from './Spot-Table';
import {
  arraySortByDateField,
  genericLastElements,
} from '../../../lib/utils/array-helpers';
import {
  roundToFloatDigits,
  formatDate,
} from '../../../lib/utils/formatting-helpers';
export const DefaultTable: React.FC<{
  measurements?: IDefaultMeasurement[];
  unit: string;
}> = ({ measurements, unit }) => {
  return (
    <Table>
      <TableBody>
        {(() => {
          if (measurements === undefined || measurements.length === 0) {
            return <TableRow th={'k. A.'} tds={['']}></TableRow>;
          }
          const dateOpts: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
            year: 'numeric',
          };
          const sortedMeasurement = measurements.sort(arraySortByDateField);
          const lastFive = genericLastElements<IDefaultMeasurement>(
            sortedMeasurement,
            5,
          );
          const rows = lastFive.reverse().map((ele, i) => {
            const tds = [`${roundToFloatDigits(ele.value, 2)} ${unit}`];
            return (
              <TableRow
                key={i}
                th={formatDate(ele.date, dateOpts)}
                tds={tds}
              ></TableRow>
            );
          });
          return rows;
        })()}
      </TableBody>
    </Table>
  );
};
