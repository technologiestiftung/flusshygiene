import React from 'react';
import { useTable } from 'react-table';
import {
  ClickFunction,
  RequestResourceTypes,
  IMeasurement,
  IDefaultMeasurement,
  IPrediction,
  IModel,
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
    case 'models': {
      const d = inData as IModel[];
      preparedColumns = [
        {
          Header: 'EC/IC Messwerte',
          columns: [
            { Header: 'id', accessor: 'id' },
            { Header: 'createdAt', accessor: 'createdAt' },
            { Header: 'comment', accessor: 'comment' },
            { Header: 'evaluation', accessor: 'evaluation' },
          ],
        },
      ];
      d.forEach((elem) => {
        preparedData.push({
          id: elem.id,
          date: elem.createdAt,
          evaluation: elem.evaluation,
          comment: elem.comment === null ? '' : elem.comment,
        });
      });
      break;
    }
    case 'measurements': {
      const d = inData as IMeasurement[];
      preparedColumns = [
        {
          Header: 'EC/IC Messwerte',
          columns: [
            { Header: 'id', accessor: 'id' },
            { Header: 'date', accessor: 'date' },
            { Header: 'conc_ec', accessor: 'conc_ec' },
            { Header: 'conc_ie', accessor: 'conc_ie' },
            { Header: 'comment', accessor: 'comment' },
          ],
        },
      ];
      d.forEach((elem) => {
        preparedData.push({
          id: elem.id,
          date: elem.date,
          conc_ec: elem.conc_ec,
          conc_ie: elem.conc_ie,
          comment: elem.comment === null ? '' : elem.comment,
        });
      });
      break;
    }
    case 'discharges':
    case 'globalIrradiances':
    case 'rains': {
      const d = inData as IDefaultMeasurement[];
      preparedColumns = [
        {
          Header: 'EC/IC Messwerte',
          columns: [
            { Header: 'id', accessor: 'id' },
            { Header: 'date', accessor: 'date' },
            { Header: 'value', accessor: 'value' },
            { Header: 'comment', accessor: 'comment' },
          ],
        },
      ];
      d.forEach((elem) => {
        preparedData.push({
          id: elem.id,
          date: elem.date,
          value: elem.value,
          comment: elem.comment === null ? '' : elem.comment,
        });
      });
      break;
    }
    case 'predictions': {
      const d = inData as IPrediction[];
      preparedColumns = [
        {
          Header: 'EC/IC Messwerte',
          columns: [
            { Header: 'id', accessor: 'id' },
            { Header: 'date', accessor: 'date' },
            { Header: 'prediction', accessor: 'prediction' },
            { Header: 'percentile 2.5', accessor: 'percentile2_5' },
            { Header: 'percentile 50', accessor: 'percentile50' },
            { Header: 'percentile 90', accessor: 'percentile90' },
            { Header: 'percentile 95', accessor: 'percentile95' },
            { Header: 'percentile 97.5', accessor: 'percentile 97_5' },
            {
              Header: 'credibleInterval 2.5',
              accessor: 'credibleInterval 2.5',
            },
            {
              Header: 'credibleInterval 97.5',
              accessor: 'credibleInterval 97.5',
            },
          ],
        },
      ];
      d.forEach((elem) => {
        preparedData.push({
          id: elem.id,
          date: elem.date,
          prediction: elem.prediction,
          percentile2_5: elem.percentile2_5 === null ? '' : elem.percentile2_5,
          percentile50: elem.percentile50 === null ? '' : elem.percentile50,
          percentile90: elem.percentile90 === null ? '' : elem.percentile90,
          percentile95: elem.percentile95 === null ? '' : elem.percentile95,
          percentile97_5:
            elem.percentile97_5 === null ? '' : elem.percentile97_5,
          credibleInterval2_5:
            elem.credibleInterval2_5 === null ? '' : elem.credibleInterval2_5,
          credibleInterval97_5:
            elem.credibleInterval97_5 === null ? '' : elem.credibleInterval97_5,
        });
      });
      break;
    }
    default: {
      throw new Error('Ne default resourceType for MeasurementEditor defined');
    }
  }
  const columns = React.useMemo(() => preparedColumns, []);
  const data = React.useMemo(() => preparedData, []);
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
