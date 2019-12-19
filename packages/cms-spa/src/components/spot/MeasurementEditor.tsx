import React from 'react';
import { useTable, TableOptions } from 'react-table';
import {
  ClickFunction,
  RequestResourceTypes,
  IObject,
  IMeasurement,
} from '../../lib/common/interfaces';
import { ButtonIcon } from '../Buttons';
import { IconCloseWin } from '../fontawesome-icons';
import { Container } from '../Container';

export const MeasurementEditor: React.FC<{
  handleCloseClick: ClickFunction;
  inData: any;
  columns?: any;
  resourceType: RequestResourceTypes;
}> = ({ handleCloseClick, inData, resourceType }) => {
  let preparedColumns;
  let preparedData: any[] = [];

  switch (resourceType) {
    case 'measurements':
      const d = inData as IMeasurement[];
      preparedColumns = [
        {
          Header: 'EC/IC Messwerte',
          columns: [
            { Header: 'ID', accessor: 'id' },
            { Header: 'Datum', accessor: 'date' },
            { Header: 'conc_ec', accessor: 'conc_ec' },
            { Header: 'conc_ie', accessor: 'conc_ie' },
          ],
        },
      ];
      d.forEach((elem) => {
        preparedData.push({
          id: elem.id,
          date: elem.date,
          conc_ec: elem.conc_ec,
          conc_ie: elem.conc_ie,
        });
      });
      break;

    default: {
      throw new Error('Ne default resourceType for MeasurementEditor defined');
    }
  }
  const columns = React.useMemo(
    () =>
      preparedColumns /*[
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
    ]*/,
    [],
  );
  const data = React.useMemo(
    () =>
      preparedData /*[
      { firstName: 'foo', lastName: 'bah' },
      { firstName: 'bo', lastName: 'bu' },
    ]*/,
    [],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });
  // console.group('Meas. Editor');
  // console.log('headerGroups:', headerGroups);
  // console.log('getTableProps:', getTableProps());
  // console.log('getTableBodyProps:', getTableBodyProps());
  // console.log('Data to edit', inData);
  // console.groupEnd()
  return (
    <>
      <Container>
        <ButtonIcon handleClick={handleCloseClick} text='schließen'>
          <IconCloseWin></IconCloseWin>
        </ButtonIcon>
        <table {...getTableProps()} className='table'>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Container>
    </>
  );
};
