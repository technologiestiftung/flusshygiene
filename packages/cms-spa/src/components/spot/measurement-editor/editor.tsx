import React, { useState } from 'react';
import { useTable, useSortBy, useRowSelect } from 'react-table';
import {
  ClickFunction,
  RequestResourceTypes,
  ApiActionTypes,
} from '../../../lib/common/interfaces';
import { ButtonIcon } from '../../Buttons';
import { IconCloseWin, IconTrash } from '../../fontawesome-icons';
import { Container } from '../../Container';
import { prepareData } from '../../../lib/utils/me-prepare-data';
import { IndeterminateCheckbox } from './indeterminate-checkbox';
import { Modal } from './modal';
import { useAuth0 } from '../../../lib/auth/react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../../../lib/config';
import { APIMountPoints, ApiResources } from '../../../lib/common/enums';
import { actionCreator } from '../../../lib/utils/pgapi-actionCreator';

export const MeasurementEditor: React.FC<{
  handleCloseClick: ClickFunction;
  inData: any;
  columns?: any;
  resourceType: RequestResourceTypes;
  headerTitle?: string;
  spotId: number;
  subItemId?: number;
  setEditMode: (value: React.SetStateAction<boolean>) => void;
  setDataEditMode: () => void;
}> = ({
  handleCloseClick,
  inData,
  resourceType,
  headerTitle,
  spotId,
  subItemId,
  setEditMode,
  setDataEditMode,
  const [preparedData, preparedColumns] = prepareData(
    inData,
    resourceType,
    headerTitle,
  );
  const [modalIsActive, setModalIsActive] = useState(false);
  const columns = React.useMemo(() => preparedColumns, []); // eslint-disable-line react-hooks/exhaustive-deps
  const data = React.useMemo(() => preparedData, []); // eslint-disable-line react-hooks/exhaustive-deps
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    //@ts-ignore
    selectedFlatRows,
    //@ts-ignore
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.flatColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox
                {...(row as any).getToggleRowSelectedProps()}
              />
            </div>
          ),
        } as any,
        ...columns,
      ]);
    },
  );
  const { user, getTokenSilently } = useAuth0();

  const callDelete = async () => {
    try {
      const token = await getTokenSilently();
      // TODO: Handle genericInputs and PPlants in URL
      // TODO: Test deletion!! 2020-02-06 18:09:41
      const BASE_URL = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spotId}`;

      let url = '';
      // console.log(resourceType);
      switch (resourceType) {
        case 'gInputMeasurements':
          url = `${BASE_URL}/${ApiResources.genericInputs}/${subItemId}/${ApiResources.measurements}`;
          break;
        case 'pplantMeasurements':
          url = `${BASE_URL}/${ApiResources.purificationPlants}/${subItemId}/${ApiResources.measurements}`;
          break;
        default:
          url = `${BASE_URL}/${resourceType}`;
          break;
      }
      const action = actionCreator({
        method: 'DELETE',
        type: ApiActionTypes.START_API_REQUEST,
        token,
        url,
        resource: resourceType,
        body: { ids },
      });

      console.log(url, action);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteClick = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    // TODO: Remove me
    // console.log('click');
    if (Object.keys(selectedRowIds).length === 0) {
      alert('Es ist nichts zum löschen ausgewählt');
      return;
    }
    setModalIsActive(true);
  };
  const handleConfirmClick = () => {
    const ids = selectedFlatRows.map((elem: any) => elem.original.id);
    console.log(ids); // eslint-disable-line
    callDelete().catch((err) => {
      console.log(err);
    });
  };
  const handleCancelClick = () => {
    setModalIsActive(false);
  };
  return (
    <>
      {modalIsActive && (
        <Modal
          isActive={modalIsActive}
          handleConfirmClick={handleConfirmClick}
          handleCancelClick={handleCancelClick}
        ></Modal>
      )}
      <Container>
        <div className='buttons buttons__spot-actions--size'>
          {(() => {
            switch (resourceType) {
              case 'discharges':
              case 'measurements':
              case 'globalIrradiances': {
                return (
                  <ButtonIcon
                    text='Daten hochladen'
                    additionalClassNames='is-primary'
                    handleClick={() => {
                      setDataEditMode();
                    }}
                  >
                    <IconCSV></IconCSV>
                  </ButtonIcon>
                );
              }
              default:
                return null;
            }
          })()}
          <ButtonIcon
            text='Auswahl löschen'
            additionalClassNames='is-primary has-tooltip-bottom'
            handleClick={handleDeleteClick}
          >
            <IconTrash></IconTrash>
          </ButtonIcon>
          <ButtonIcon handleClick={handleCloseClick} text='schließen'>
            <IconCloseWin></IconCloseWin>
          </ButtonIcon>
        </div>
      </Container>
      <Container columnClassName='is-10 table__data-view--scroll'>
        <table {...getTableProps()} className='table'>
          <thead>
            {/* TODO: react-table types are out of sync https://github.com/tannerlinsley/react-table/issues/1591 */}
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(
                      (column as any).getSortByToggleProps(),
                    )}
                  >
                    {column.render('Header')}
                    <span>
                      {(column as any).isSorted
                        ? (column as any).isSortedDesc
                          ? ' ↓'
                          : ' ↑'
                        : ''}
                    </span>
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
      <Container>
        <div className='content'>
          <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
          <pre>
            <code>
              {JSON.stringify(
                {
                  selectedRowIds: selectedRowIds,
                  'selectedFlatRows[].original': selectedFlatRows.map(
                    (d) => d.original,
                  ),
                },
                null,
                2,
              )}
            </code>
          </pre>
        </div>
      </Container>
    </>
  );
};
