// import { DEFAULT_SPOT_ID } from '../lib/common/constants';
import { APIMountPoints, ApiResources, RouteNames } from '../lib/common/enums';
import { fetchSingleSpot } from '../lib/state/reducers/actions/fetch-get-single-spot';
import {
  IFetchSpotOptions,
  IOcpuStartAction,
  IObject,
  IBathingspot,
  IRain,
} from '../lib/common/interfaces';
import { Link } from 'react-router-dom';
import { Measurement, MeasurementTableRow } from './spot/Spot-Measurement';
import { RootState } from '../lib/state/reducers/root-reducer';
import { RouteComponentProps } from 'react-router';
import { SpotBodyAddonTagGroup } from './spot/Spot-AddonTag-Group';
import { SpotHeader } from './spot/Spot-Header';
import { SpotImage } from './spot/Spot-Image';
import { SpotLocation } from './spot/Spot-Location';
import { useMapResizeEffect } from '../hooks/map-hooks';
import { useSelector, useDispatch } from 'react-redux';
import React, { useRef, useEffect, useState } from 'react';
import { SpotEditor } from './spot/SpotEditor';
import SpotsMap from './spot/Spot-Map';

// import '../assets/styles/spot-editor.scss';
import { useAuth0 } from '../lib/auth/react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../lib/config';
import { Container, ContainerNoColumn } from './Container';
import { useOcpu, postOcpu } from '../contexts/opencpu';
import {
  lastElements,
  arraySortByDateField,
  genericLastElements,
} from '../lib/utils/array-helpers';
import { Table, TableBody, TableRow } from './spot/Spot-Table';
import { ButtonIconTB } from './Buttons';
import {
  IconRain,
  IconEdit,
  IconCalc,
  IconComment,
  IconCSV,
} from './fontawesome-icons';
import {
  formatDate,
  roundToFloatDigits,
} from '../lib/utils/formatting-helpers';
const messageCalibratePredict = {
  calibrate:
    'Ihre Kalibrierung wurde gestartet. Abhängig von der Menge an Messwerten kann dies dauern. Bitte kommen Sie in einigen Minuten zurück.',
  predict:
    'Ihre Vorhersagegenerierung wurde gestartet. Abhängig von der Menge an Messwerten kann dies dauern. Bitte kommen Sie in einigen Minuten zurück.',
  model:
    'Ihre Modelierung wurde gestartet. Dies kann etwas dauern. Bitte kommen Sie in einigen Minuten zurück.',
};
type RouteProps = RouteComponentProps<{ id: string }>;

const Spot: React.FC<RouteProps> = ({ match }) => {
  const { user, isAuthenticated, getTokenSilently } = useAuth0();
  const [ocpuState, ocpuDispatch] = useOcpu();

  const handleEditModeClick = () => {
    setEditMode(!editMode);
  };
  const handleCalibratePredictClick = (event: React.ChangeEvent<any>) => {
    switch (event.currentTarget.id) {
      case 'predict':
      case 'model':
      case 'calibrate':
        {
          const body = {
            spot_id: spot.id,
            user_id: user.pgapiData.id,
          };
          // console.log('the body we will send', body);
          const action: IOcpuStartAction = {
            type: 'START_OCPU_REQUEST',
            payload: {
              url: `/middlelayer/${event.currentTarget.id}`,
              processingType: event.currentTarget.id,
              config: {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
              },
            },
          };
          postOcpu(ocpuDispatch, action);
          console.log(`clicked ${event.currentTarget.id}`);
        }
        break;
      default:
        throw new Error('Target for button not defined');
    }
    setCalibratePredictSelector(event.currentTarget.id);
    setShowNotification((prevState) => !prevState);
  };
  const dispatch = useDispatch();
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [token, setToken] = useState<string>();
  const [calibratePredictSelector, setCalibratePredictSelector] = useState<
    'calibrate' | 'predict' | 'model' | undefined
  >(undefined);
  const [showNotification, setShowNotification] = useState(false);
  const spot = useSelector(
    (state: RootState) => state.detailSpot.spot as IBathingspot,
  );
  const isSingleSpotLoading = useSelector(
    (state: RootState) => state.detailSpot.loading,
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);

  // const fetchOpts: IFetchSpotOptions = {
  //   method: 'GET',
  //   url: `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.bathingspots}/${match.params.id}`,
  //   headers: {
  //     'content-type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  useEffect(() => {
    async function getToken() {
      try {
        const t = await getTokenSilently();
        setToken(t);
      } catch (error) {
        console.error(error);
      }
    }
    getToken();
  }, [getTokenSilently, setToken]);

  useEffect(() => {
    if (showNotification === false) return;
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  }, [showNotification]);

  useEffect(() => {
    // if (spot.id === parseInt(match.params.id, 10)) {
    //   return;
    // }
    if (token === undefined) return;
    if (user.pgapiData === undefined) return;
    const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${match.params.id}`;
    const fetchOpts: IFetchSpotOptions = {
      method: 'GET',
      url,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    dispatch(fetchSingleSpot(fetchOpts));
    // setFormReadyToRender(true);
  }, [dispatch, match.params.id, token, user, user.pgapiData]);

  // useEffect(() => {
  //   if (
  //     spot.id === parseInt(match.params.id!, 10) ||
  //     spot.id !== DEFAULT_SPOT_ID
  //   ) {
  //     return;
  //   }
  //   dispatch(fetchSingleSpot(fetchOpts));
  // }, [spot, dispatch, match.params.id, fetchOpts]);

  useEffect(() => {
    if (spot.id === parseInt(match.params.id!, 10)) {
      setFormReadyToRender(true);
    }
  }, [setFormReadyToRender, spot.id, match.params.id]);

  if (editMode === true) {
    return (
      <div className='container'>
        <div className='columns is-centered'>
          <div className='column is-10'>
            {formReadyToRender === true && editMode === true && (
              <SpotEditor
                initialSpot={spot}
                handleEditModeClick={handleEditModeClick}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {showNotification === true && (
          <Container>
            <div className='notification spot__calib-notification--on-top'>
              {calibratePredictSelector !== undefined
                ? messageCalibratePredict[calibratePredictSelector]
                : ''}
              {JSON.stringify(ocpuState.responses[0])}
            </div>
          </Container>
        )}
        <Container>
          {/* {isSingleSpotLoading === true && <div>loading data</div>} */}
          <SpotHeader
            name={spot.name}
            nameLong={spot.nameLong}
            water={spot.water}
            district={spot.district}
            isLoading={isSingleSpotLoading}
          />
        </Container>
        <Container>
          <hr />
        </Container>
        {isAuthenticated === true && (
          <Container>
            <div className='buttons buttons__spot-actions--size'>
              <ButtonIconTB
                cssId='edit'
                handleClick={handleEditModeClick}
                text='Editieren'
              >
                <IconEdit></IconEdit>
              </ButtonIconTB>
              {/* <button className='button is-small' onClick={handleEditModeClick}>
                Editieren
              </button> */}
              <ButtonIconTB
                cssId='calibrate'
                additionalClassNames={
                  ocpuState.processing === 'calibrate' ? 'is-loading' : ''
                }
                handleClick={handleCalibratePredictClick}
                text='Regen Laden'
              >
                <IconRain></IconRain>
              </ButtonIconTB>
              {/* <button
                className='button is-small'
                onClick={handleCalibratePredictClick}
                id='calibrate'
              >
                Regen Kalibrierung
              </button> */}
              {/* <button
                className='button is-small'
                onClick={handleCalibratePredictClick}
                id='model'
              >
                Modellierung
              </button> */}
              <ButtonIconTB
                cssId='model'
                additionalClassNames={
                  ocpuState.processing === 'model' ? 'is-loading' : ''
                }
                handleClick={handleCalibratePredictClick}
                text='Modellierung'
              >
                <IconCalc></IconCalc>
              </ButtonIconTB>
              <ButtonIconTB
                cssId='predict'
                additionalClassNames={
                  ocpuState.processing === 'predict' ? 'is-loading' : ''
                }
                handleClick={handleCalibratePredictClick}
                text='Vorhersage'
              >
                <IconComment></IconComment>
              </ButtonIconTB>
              {/* <button
                className='button is-small'
                onClick={handleCalibratePredictClick}
                id='predict'
              >
                Vorhersage
              </button> */}
            </div>
          </Container>
        )}

        <ContainerNoColumn>
          <div className='column is-5'>
            <h3 className='is-title is-3'>
              <span>
                <IconComment></IconComment>
              </span>{' '}
              <span>Vorhersage</span>
            </h3>
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
                          th={new Date(ele.date).toLocaleDateString(
                            'de-DE',
                            dateOpts,
                          )}
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
          </div>
          <div className='column is-5'>
            <h3 className='is-title is-3'>
              <span>
                <IconCSV></IconCSV>
              </span>{' '}
              <span>Wasserqualität </span>
            </h3>
            {(() => {
              if (
                spot !== undefined &&
                spot.measurements !== undefined &&
                spot.measurements.length > 0
              ) {
                return (
                  <Measurement
                    measurements={spot.measurements}
                    hasPrediction={spot.hasPrediction}
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
            })()}
          </div>
        </ContainerNoColumn>
        <ContainerNoColumn>
          <div className='column is-5'>
            <div className='bathingspot__rain'>
              <h3 className='is-title is-3'>
                <span>
                  <IconRain></IconRain>
                </span>{' '}
                <span>Durchs. Regenmengen</span>
              </h3>
              <Table>
                <TableBody>
                  {spot !== undefined &&
                    (() => {
                      if (spot.rains === undefined || spot.rains.length === 0) {
                        return <TableRow th={'k. A.'} tds={['']}></TableRow>;
                      } else {
                        const dateOpts: Intl.DateTimeFormatOptions = {
                          day: 'numeric',
                          month: 'short',
                          weekday: 'short',
                          year: 'numeric',
                        };
                        const sortedRain = spot.rains.sort(
                          arraySortByDateField,
                        );
                        const lastFive = genericLastElements<IRain>(
                          sortedRain,
                          5,
                        );

                        const rows = lastFive.reverse().map((ele, i) => {
                          const tds = [
                            `${roundToFloatDigits(ele.value, 2)} mm`,
                          ];
                          return (
                            <TableRow
                              key={i}
                              th={formatDate(ele.date, dateOpts)}
                              tds={tds}
                            ></TableRow>
                          );
                        });
                        return rows;
                      }
                    })()}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className='column is-5'>
            <div className='bathingspot__model'>
              <h3 className='is-title is-3'>
                <span>
                  <IconCalc></IconCalc>
                </span>{' '}
                <span>Vorhersage-Modelle</span>
              </h3>

              {spot !== undefined && spot.models !== undefined && (
                <>
                  {/* <table className='table'> */}
                  {/* <tbody> */}
                  {(() => {
                    const dateOpts = {
                      day: 'numeric',
                      month: 'short',
                      weekday: 'short',
                      year: 'numeric',
                    };

                    const sortedModels = spot.models.sort(
                      (a: IObject, b: IObject) => {
                        return (
                          ((new Date(a.updatedAt) as unknown) as number) -
                          ((new Date(b.updatedAt) as unknown) as number)
                        );
                      },
                    );

                    const lastModel = sortedModels[sortedModels.length - 1];

                    console.log(lastModel);
                    interface IModelInfo {
                      formula: string;
                      N: number;
                      BP: number;
                      R2: number;
                      n_obs: number;
                      stat_correct: boolean;
                      in50: number;
                      below90: number;
                      below95: number;
                      in95: number;
                    }

                    // {"formula":"log_e.coli ~ r_mean_mean_345","N":0.713,"BP":0.0187,"R2":0.1198,"n_obs":18,"stat_correct":false,"in50":5,"below90":5,"below95":5,"in95":5};
                    let jsonData: IModelInfo;

                    try {
                      jsonData = JSON.parse(
                        lastModel.comment !== undefined
                          ? lastModel.comment
                          : '',
                      );
                    } catch (error) {
                      jsonData = {} as IModelInfo;
                    }
                    const lastFive = sortedModels.slice(
                      Math.max(sortedModels.length - 5, 0),
                    );

                    const rows = lastFive
                      .reverse()
                      .map((ele, i) => (
                        <MeasurementTableRow
                          key={i}
                          rowKey={`ID: ${ele.id}`}
                          rowValue={`Generiert am: ${new Date(
                            ele.updatedAt,
                          ).toLocaleDateString('de-DE', dateOpts)}`}
                        />
                      ));

                    if (lastModel === undefined) {
                      return (
                        <Table>
                          <TableBody>
                            <TableRow th={'k. A.'} tds={['']}></TableRow>
                          </TableBody>
                        </Table>
                      );
                    }
                    return (
                      <Table>
                        <TableBody>
                          <TableRow th={'ID:'} tds={[lastModel.id]} />
                          <TableRow
                            th={'Generiert am:'}
                            tds={[
                              `${new Date(
                                lastModel.updatedAt,
                              ).toLocaleDateString('de-DE', dateOpts)}`,
                            ]}
                          />
                          <TableRow th={'Formel'} tds={[jsonData.formula]} />
                          <TableRow
                            th={'Anzahl der Datenpunkte'}
                            tds={[`${jsonData.n_obs}`]}
                          />
                          <TableRow
                            th={'Bestimmtheitsmaß (R\u00B2)'}
                            tds={[`${jsonData.R2}`]}
                          />
                        </TableBody>
                      </Table>
                    );
                  })()}
                  {/* </tbody> */}
                  {/* </table> */}
                </>
              )}
            </div>
          </div>
        </ContainerNoColumn>
        <Container>
          {isSingleSpotLoading === false && (
            <div ref={mapRef} id='map__container'>
              <SpotsMap
                width={mapDims.width}
                height={mapDims.height}
                data={(() => {
                  return Array.isArray(spot) === true ? spot : [spot];
                })()}
                zoom={4}
              />
            </div>
          )}
        </Container>
        <ContainerNoColumn>
          {spot !== undefined && (
            <>
              <div className='column is-5'>
                <SpotLocation
                  name={spot.name}
                  nameLong={spot.nameLong}
                  street={spot.street}
                  location={spot.location}
                  postalCode={(() => {
                    if (
                      spot.postalCode !== undefined &&
                      spot.postalCode !== null
                    ) {
                      return `${spot.postalCode}`;
                    }
                    return '';
                  })()}
                  city={spot.city}
                  website={spot.website}
                />
              </div>
              <div className='column is-5'>
                <SpotImage
                  image={spot.image}
                  nameLong={spot.nameLong}
                  name={spot.name}
                  imageAuthor={undefined}
                />
              </div>
            </>
          )}
        </ContainerNoColumn>
        <Container>
          {spot !== undefined && (
            <div className='bathingspot__body-addon'>
              <h3>Weitere Angaben zur Badesstelle</h3>
              <SpotBodyAddonTagGroup
                cyanoPossible={spot.cyanoPossible}
                lifeguard={spot.lifeguard}
                disabilityAccess={spot.disabilityAccess}
                hasDisabilityAccesableEntrence={
                  spot.hasDisabilityAccesableEntrence
                }
                restaurant={spot.restaurant}
                snack={spot.snack}
                parkingSpots={spot.parkingSpots}
                bathrooms={spot.bathrooms}
                disabilityAccessBathrooms={spot.disabilityAccessBathrooms}
                bathroomsMobile={spot.bathroomsMobile}
                dogban={spot.dogban}
              />
            </div>
          )}
        </Container>
      </>
    );
  }
};

export default Spot;
