import React from 'react';
import { IObject } from '../../lib/common/interfaces';
import { Table, TableBody, TableRow } from './Spot-Table';
import { IModelInfo } from '../Spot';
export function SpotModelTable(lastModel?: IObject) {
  const dateOpts = {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
    year: 'numeric',
  };
  let jsonData: IModelInfo;

  if (lastModel === undefined) {
    return (
      <Table>
        <TableBody>
          <TableRow th={'k. A.'} tds={['']}></TableRow>
        </TableBody>
      </Table>
    );
  } else {
    try {
      jsonData = JSON.parse(
        lastModel.comment !== undefined ? lastModel.comment : '',
      );
    } catch (error) {
      jsonData = {} as IModelInfo;
    }
    return (
      <Table>
        <TableBody>
          <TableRow th={'ID:'} tds={[lastModel.id]} />
          <TableRow
            th={'Generiert am:'}
            tds={[
              `${new Date(lastModel.updatedAt).toLocaleDateString(
                'de-DE',
                dateOpts,
              )}`,
            ]}
          />
          <TableRow
            th={'Formel'}
            tds={[
              jsonData.formula === undefined || jsonData.formula.length === 0
                ? 'k. A.'
                : jsonData.formula,
            ]}
          />
          <TableRow
            th={'Anzahl der Datenpunkte'}
            tds={[`${jsonData.n_obs ? jsonData.n_obs : 'k. A.'}`]}
          />
          <TableRow
            th={'Bestimmtheitsmaß (R\u00B2)'}
            tds={[`${jsonData.R2 ? jsonData.R2 : 'k. A.'}`]}
          />
        </TableBody>
      </Table>
    );
  }
}
