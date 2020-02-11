import React from 'react';
import {
  IPurificationPlant,
  IGenericInput,
  ClickFunction,
} from '../../../lib/common/interfaces';
import { TableBody, Table, TableRow, TableRowWithButton } from './Spot-Table';

interface ICollection {
  items?: IPurificationPlant[] | IGenericInput[];
  setData: (value: React.SetStateAction<any[] | undefined>) => void;
  setTitle: (value: React.SetStateAction<string | undefined>) => void;
  setSubItemId: (value: React.SetStateAction<number | undefined>) => void;
  handleEditClick: ClickFunction;
}
export const CollectionWithSubItemTable: React.FC<ICollection> = ({
  items,
  setData,
  setTitle,
  setSubItemId,
  handleEditClick,
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
              <TableRowWithButton
                key={index}
                th={item.name}
                // disabled={
                //   item.measurements !== undefined &&
                //   item.measurements.length > 0
                //     ? false
                //     : true
                // }
                handleEditClick={(e?: React.ChangeEvent<any>) => {
                  e?.preventDefault();
                  setTitle(
                    `${item.name}${
                      item.url
                        ? ' || ' +
                          item.url
                            .replace(/http(s)?:\/\//, '')
                            .substring(0, 13) +
                          '…'
                        : ''
                    }`,
                  );
                  setData(item.measurements);
                  setSubItemId(item.id);
                  handleEditClick();
                  // console.log('edit table row');
                }}
                tds={[
                  'Datenpunkte',
                  item.measurements ? `${item.measurements.length}` : 'k. A.',
                  `Autom.: ${item.url ? '✓' : '✘'}`,
                ]}
              ></TableRowWithButton>
            );
          })}
        </TableBody>
      </Table>
    );
  }
};
