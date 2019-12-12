import React from 'react';
import { IPurificationPlant } from '../../../lib/common/interfaces';
import { TableBody, Table, TableRow } from './Spot-Table';

interface ICollection {
  items?: IPurificationPlant[];
}
export const CollectionWithSubItemTable: React.FC<ICollection> = ({
  items,
}) => {
  if (items === undefined) {
    return (
      <Table>
        <TableBody>
          <TableRow th={'k. A.'} tds={['']}></TableRow>
        </TableBody>
      </Table>
    );
  } else {
    return (
      <Table>
        <TableBody>
          {items.map((item, index) => {
            return (
              <TableRow
                key={index}
                th={item.name}
                tds={[
                  'Datenpunkte',
                  item.measurements ? `${item.measurements.length}` : 'k. A.',
                ]}
              ></TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
};
