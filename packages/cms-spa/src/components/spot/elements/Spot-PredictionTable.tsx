import { IObject, IBathingspot } from '../../../lib/common/interfaces';
import React from 'react';
import { lastElements } from '../../../lib/utils/array-helpers';
import { Table, TableBody, TableRow } from './Spot-Table';
export function PredictionTable(spot: IBathingspot): React.ReactNode {
  return (
    <Table>
      <TableBody>
        {spot !== undefined &&
          spot.predictions !== undefined &&
          (() => {
            const dateOpts = {
              day: 'numeric',
              month: 'short',
              weekday: 'short',
              year: 'numeric',
            };
            const sortedPredictions = spot.predictions.sort(
              (a: IObject, b: IObject) => {
                return (
                  ((new Date(a.updatedAt) as unknown) as number) -
                  ((new Date(b.updatedAt) as unknown) as number)
                );
              },
            );
            const lastFive = lastElements(sortedPredictions, 5);
            const rows = lastFive.reverse().map((ele, i) => {
              const tds = [ele.prediction];
              return (
                <TableRow
                  key={i}
                  th={new Date(ele.date).toLocaleDateString('de-DE', dateOpts)}
                  tds={tds}
                />
              );
            });
            if (rows.length === 0) {
              return <TableRow th='k. A.' tds={['']} />;
            }
            return rows;
          })()}
      </TableBody>
    </Table>
  );
}
