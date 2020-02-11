import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, useRowSelect } from 'react-table';
import {
  ClickFunction,
  RequestResourceTypes,
  ApiActionTypes,
  IInitialGiPPValues,
  IGenericInput,
  IPurificationPlant,
} from '../../../lib/common/interfaces';
import { ButtonIcon } from '../../Buttons';
import {
  IconCloseWin,
  IconTrash,
  IconCSV,
  IconPlus,
  IconEdit,
} from '../../fontawesome-icons';
import { Container } from '../../Container';
import { prepareData } from '../../../lib/utils/me-prepare-data';
import { IndeterminateCheckbox } from './indeterminate-checkbox';
import { Modal } from './modal';
import { useAuth0 } from '../../../lib/auth/react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../../../lib/config';
import { APIMountPoints, ApiResources } from '../../../lib/common/enums';
import { actionCreator } from '../../../lib/utils/pgapi-actionCreator';
import { apiRequest, useApi } from '../../../contexts/postgres-api';
import { GIPPEditor } from './gi-pp-editor';
import { GiPPUploader } from './gi-pp-uploader';

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
}) => {
  const [apiState, apiDispatch] = useApi();
  const [giInfos, setGiInfos] = useState<IGenericInput | undefined>(undefined);
  const [ppInfos, setPPInfos] = useState<IPurificationPlant | undefined>(
    undefined,
  );
  const [ppgiReqType, setPpgiReqType] = useState<'PUT' | 'POST' | undefined>(
    undefined,
  );
  useEffect(() => {
    if (apiState === undefined) return;
    if (apiState.spots.length === 0) return;
    const filteredSpots = apiState.spots.filter((spot) => (spot.id = spotId));
    if (filteredSpots.length === 0) return;
    const curSpot = filteredSpots[0];

    switch (resourceType) {
      case 'gInputMeasurements': {
        if (
          curSpot.genericInputs === undefined ||
          curSpot.genericInputs.length === 0
        )
          return;

        const filtered = curSpot.genericInputs.filter(
          (elem) => elem.id === subItemId,
        );
        if (filtered.length === 0) return;
        const item = filtered[0];
        setGiInfos(item);
        break;
      }
      case 'pplantMeasurements': {
        if (
          curSpot.purificationPlants === undefined ||
          curSpot.purificationPlants.length === 0
        )
          return;

        const filtered = curSpot.purificationPlants.filter(
          (elem) => elem.id === subItemId,
        );
        if (filtered.length === 0) return;
        const item = filtered[0];
        setPPInfos(item);
        break;
      }
    }
  }, [apiState, resourceType, subItemId, spotId]);
  const [preparedData, preparedColumns] = prepareData(
    inData,
    resourceType,
    headerTitle,
  );
  const [showGiPPEditor, setShowGiPPEditor] = useState(false);
  const [showGiPPUploader, setShowGiPPUploader] = useState(false);
  const [gippInitialValues, setGippInitialState] = useState<
    IInitialGiPPValues | undefined
  >(undefined);
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

  const callDelete: (ids: number[]) => Promise<void> = async (ids) => {
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

      // console.log(url, action);
      apiRequest(apiDispatch, action);
      setEditMode(false);
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
    callDelete(ids).catch((err: Error) => {
      console.error(err);
    });
  };
  const handleCancelClick = () => {
    setModalIsActive(false);
  };
  const handleGiPPCancelClick = () => {
    setShowGiPPEditor(false);
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

      {showGiPPEditor && (
        <GIPPEditor
          userId={user.pgapiData.id}
          spotId={spotId}
          subItemId={subItemId}
          resourceType={resourceType}
          reqType={ppgiReqType}
          handleCancelClick={handleGiPPCancelClick}
          intitalValues={gippInitialValues}
          handleSubmitClose={() => {
            // handleCloseClick();
            // setShowGiPPEditor(false);
            setEditMode(false);
          }}
        ></GIPPEditor>
      )}

      {(() => {
        switch (resourceType) {
          case 'rains':
          case 'models':
          case 'predictions': {
            return (
              <Container>
                <div className='content'>
                  <p className='is-warning'>
                    Diese Werte werden vom Vorhersage System generiert und
                    sollten nicht manuell bearbeitet werden.
                  </p>
                </div>
              </Container>
            );
          }
          default:
            return null;
        }
      })()}
      {showGiPPUploader === true && subItemId !== undefined && (
        <GiPPUploader
          userId={user.pgapiData.id}
          spotId={spotId}
          subItemId={subItemId}
          resourceType={resourceType}
          handleCancelClick={() => {
            setShowGiPPUploader(false);
          }}
        ></GiPPUploader>
      )}
      {showGiPPEditor === false && showGiPPUploader === false && (
        <>
          {' '}
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
                  case 'genericInputs':
                  case 'purificationPlants': {
                    return (
                      <ButtonIcon
                        text={`${
                          resourceType === 'genericInputs'
                            ? 'Gener. Werte'
                            : 'Klärwerk'
                        } hinzufügen`}
                        additionalClassNames='is-primary'
                        handleClick={() => {
                          setShowGiPPEditor(true);
                          setPpgiReqType('POST');
                          setGippInitialState(undefined);
                          console.log('klick', resourceType);
                        }}
                      >
                        <IconPlus></IconPlus>
                      </ButtonIcon>
                    );
                  }
                  case 'gInputMeasurements':
                  case 'pplantMeasurements': {
                    return (
                      <>
                        <ButtonIcon
                          text={'Daten hochladen'}
                          // additionalClassNames='is-primary'
                          handleClick={() => {
                            setShowGiPPUploader(true);

                            console.log('daten hochladen für', resourceType);
                          }}
                        >
                          <IconCSV></IconCSV>
                        </ButtonIcon>
                        <ButtonIcon
                          text={'Bearbeiten'}
                          handleClick={() => {
                            // console.log('daten bearbeitet für', resourceType);
                            switch (resourceType) {
                              case 'gInputMeasurements': {
                                setGippInitialState({
                                  name: giInfos
                                    ? giInfos.name
                                    : 'Error getting name',
                                  url: giInfos?.url,
                                });
                                break;
                              }
                              case 'pplantMeasurements': {
                                setGippInitialState({
                                  name: ppInfos
                                    ? ppInfos.name
                                    : 'Error getting name',
                                  url: ppInfos?.url,
                                });
                              }
                            }
                            setPpgiReqType('PUT');
                            setShowGiPPEditor(true);
                          }}
                        >
                          {' '}
                          <IconEdit></IconEdit>{' '}
                        </ButtonIcon>
                      </>
                    );
                  }
                  default:
                    return null;
                }
              })()}
              <ButtonIcon handleClick={handleCloseClick} text='Abbrechen'>
                <IconCloseWin></IconCloseWin>
              </ButtonIcon>
              <ButtonIcon
                text='Auswahl löschen'
                additionalClassNames='is-warning'
                handleClick={handleDeleteClick}
              >
                <IconTrash></IconTrash>
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
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Container>
        </>
      )}
    </>
  );
};
