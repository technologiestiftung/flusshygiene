import React from 'react';
import { IBathingspot } from '../../../lib/common/interfaces';
import { Measurement } from './Spot-Measurement';
import { Table, TableBody, TableRow } from './Spot-Table';
export function SpotMeasurementsTable(spot: IBathingspot) {
  if (
    spot !== undefined &&
    spot.measurements !== undefined &&
    spot.measurements.length > 0
  ) {
    return (
      <Measurement
        measurements={spot.measurements}
        hasPrediction={spot.hasPrediction}
        hasAutoData={spot.apiEndpoints?.measurementsUrl !== undefined}
      ></Measurement>
    );
  } else {
    return (
      <Table>
        <TableBody>
          <TableRow th={'k. A.'} tds={['']}></TableRow>
        </TableBody>
      </Table>
    );
  }
}
