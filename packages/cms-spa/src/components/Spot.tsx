import React, { useRef, useEffect, useState } from 'react';
import { actionCreator } from '../lib/utils/pgapi-actionCreator';
import { APIMountPoints, ApiResources } from '../lib/common/enums';

import {
  IOcpuStartAction,
  IObject,
  IBathingspot,
  ApiActionTypes,
  RouteProps,
  ClickHandler,
  IApiAction,
  IPurificationPlant,
} from '../lib/common/interfaces';

import { SpotHeader } from './spot/elements/Spot-Header';
import { useMapResizeEffect } from '../hooks/map-hooks';
import { SpotEditorBasisData } from './spot/SpotEditor-Basis-Data';
import { SpotModelPlots } from './spot/elements/Spot-Model-Plots';
import { useAuth0 } from '../lib/auth/react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../lib/config';
import { Container, ContainerNoColumn } from './Container';
import { useOcpu, postOcpu } from '../contexts/opencpu';
import { useEventSource } from '../contexts/eventsource';
import { useApi, apiRequest } from '../contexts/postgres-api';
import { Banner } from './spot/elements/Spot-Banner';
import { SpotButtonBar } from './spot/elements/Spot-ButtonBar';
import { SpotAdditionalTags } from './spot/elements/Spot-AdditionalTags';
import { SpotBasicInfos } from './spot/elements/Spot-BasicInfos';
import { MapWrapper } from './spot/elements/Spot-Map-Wrapper';
import { PredictionTable } from './spot/elements/Spot-PredictionTable';
import { RainTable } from './spot/elements/Spot-RainTable';
import { SpotMeasurementsTable } from './spot/elements/Spot-MeasurementsTable';
import { SpotModelTable } from './spot/elements/Spot-ModelTable';
import { SpotTableBlock } from './spot/elements/Spot-TableBlock';
import { SpotHr } from './spot/elements/Spot-Hr';
import { Spinner } from './util/Spinner';
import { SpotEditorMeasurmentsUpload } from './spot/SpotEditor-Measurments';
import { SpotEditorInfoModal } from './spot/elements/SpotEditor-InfoModal';
import { DefaultTable } from './spot/elements/Spot-DefaultMeasurementsTable';
import {
  SpotEditorPurificationPlants,
  ISpotEditorPurificationPlantsInitialValues,
} from './spot/SpotEditor-PurificationPlants';
import { CollectionWithSubItemTable } from './spot/elements/Spot-CollectionWithSubitemsTable';
/**
 * This is the component that displays a single spot
 *
 */
const Spot: React.FC<RouteProps> = ({ match }) => {
  const { user, isAuthenticated, getTokenSilently } = useAuth0();
  const [ocpuState, ocpuDispatch] = useOcpu();
  const [apiState, apiDispatch] = useApi();
  const eventSourceState = useEventSource();
  // const dispatch = useDispatch();
  const [message, setMessage] = useState<string>('');
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [basisEditMode, setBasisEditMode] = useState(false);
  const [dataEditMode, setDataEditMode] = useState(false);
  const [ppDataEditMode, setPPDataEditMode] = useState(false);
  const [infoShowMode, setInfoShowMode] = useState(false);
  const [lastModel, setLastModel] = useState<IObject>();
  const [token, setToken] = useState<string>();

  const [showNotification, setShowNotification] = useState(false);

  const [spot, setSpot] = useState<IBathingspot | undefined>(undefined);
  const [purificationPlants, setPurificationPlants] = useState<
    IPurificationPlant[] | undefined
  >(undefined);
  const [pplantsNumber, setPPlantsNumber] = useState<number | undefined>(
    undefined,
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);

  /**
   * Toggles the edit modes (open BasisSpotEditor)
   */
  const handleBasisEditModeClick = (e?: React.ChangeEvent<any>) => {
    if (e) {
      e.preventDefault();
    }
    // e?.preventDefault?.();
    setBasisEditMode(!basisEditMode);
  };

  const handleDataEditModeClick = (e?: React.ChangeEvent<any>) => {
    if (e) {
      e.preventDefault();
    }
    // e?.preventDefault?.();
    setDataEditMode(!dataEditMode);
  };
  const handlePPDataEditModeClick = (e?: React.ChangeEvent<any>) => {
    // if (e) {
    //   e.preventDefault();
    // }
    e?.preventDefault?.();
    setPPDataEditMode(!ppDataEditMode);
  };

  const handleInfoShowModeClick = (e?: React.ChangeEvent<any>) => {
    if (e) {
      e.preventDefault();
    }
    // e?.preventDefault?.();
    setInfoShowMode(!infoShowMode);
  };
  /**
   * Handles the click events on the button bar on top for all the calls to middlelayer
   *
   */
  const handleCalibratePredictClick: ClickHandler = (event) => {
    if (spot === undefined) return;
    switch (event.currentTarget.id) {
      case 'sleep':
      case 'predict':
      case 'model':
      case 'calibrate':
        {
          let body: { spot_id?: number; user_id?: any; seconds?: number };
          body = {
            spot_id: spot.id,
            user_id: user.pgapiData.id,
          };
          if (event.currentTarget.id === 'sleep') {
            body = { seconds: 10 };
          }
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
        }
        break;
      default:
        throw new Error('Target for button not defined');
    }
    setShowNotification((prevState) => !prevState);
  };

  /**
   * This effect triggers a reload of the page
   */
  // useEffect(() => {
  //   if (apiState === undefined) return;
  //   if (apiState.reload === false) return;
  //   if (apiState.loading === true) return;
  //   if (apiState.reload === true && apiState.loading === false) {
  //     window.location.reload();
  //   }
  // }, [apiState.reload, apiState.loading]);

  /**
   * This effect gets the api token from the auth0 wrapper
   *
   *
   */
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

  /**
   * Timing effect for the banner display time
   */
  useEffect(() => {
    if (showNotification === false) return;
    const timeout = setTimeout(() => {
      setShowNotification(false);
    }, 7000);

    return () => {
      clearTimeout(timeout);
    };
  }, [showNotification]);

  /**
   * this effect sets the content of the banner based on ocpu data
   *
   */
  useEffect(() => {
    setMessage(JSON.stringify(ocpuState.responses[0]));
    setShowNotification(true);
  }, [ocpuState]);

  /**
   * This effect sets the current content of the Banner based on event souce data
   *
   *
   *
   */
  useEffect(() => {
    setMessage(JSON.stringify(eventSourceState));
    setShowNotification(true);
  }, [eventSourceState]);

  useEffect(() => {
    if (apiState.error === undefined) return;
    setMessage(JSON.stringify(apiState.error.error.message));
    setShowNotification(true);
  }, [apiState.error]);
  /**
   * This effect gets one bathingspot
   * Follow the crumbs to contexts/postgres-api
   */
  useEffect(() => {
    if (token === undefined) return;
    if (user.pgapiData === undefined) return;

    const baseUrl = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${match.params.id}`;
    // const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${match.params.id}`;

    const actions: IApiAction[] = [];

    actions.push(
      actionCreator({
        body: {},
        token,
        method: 'GET',
        url: baseUrl,
        type: ApiActionTypes.START_API_REQUEST,
        resource: 'bathingspot',
      }),
    );

    /**
     * Actions for
     * rains
     * discharges
     * measurements
     * models
     * predictions
     * globalIrradiance
     *
     */
    if (actions.length > 0) {
      actions.forEach((action) => {
        apiRequest(apiDispatch, action);
      });
    }
  }, [
    token,
    apiDispatch,
    match.params.id,
    user.pgapiData,
    apiState.reload,
    eventSourceState,
  ]);

  useEffect(() => {
    if (token === undefined) return;
    if (user.pgapiData === undefined) return;

    const baseUrl = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${match.params.id}`;

    const actions: IApiAction[] = [];

    actions.push(
      actionCreator({
        body: {},
        token,
        method: 'GET',
        url: `${baseUrl}/${ApiResources.measurements}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: 'measurements',
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: 'GET',
        url: `${baseUrl}/${ApiResources.globalIrradiances}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: 'globalIrradiances',
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: 'GET',
        url: `${baseUrl}/${ApiResources.discharges}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: 'discharges',
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: 'GET',
        url: `${baseUrl}/${ApiResources.rains}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: 'rains',
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: 'GET',
        url: `${baseUrl}/${ApiResources.purificationPlants}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: 'purificationPlants',
      }),
    );

    if (spot !== undefined && spot.purificationPlants !== undefined) {
      spot.purificationPlants.forEach((plant) => {
        actions.push(
          actionCreator({
            body: {},
            token,
            method: 'GET',
            url: `${baseUrl}/${ApiResources.purificationPlants}/${plant.id}/${ApiResources.measurements}`,
            type: ApiActionTypes.START_API_REQUEST,
            resource: 'pplantMeasurements',
          }),
        );
      });
    }
    if (actions.length > 0) {
      actions.forEach((action) => {
        apiRequest(apiDispatch, action);
      });
    }
  }, [spot, user.pgapiData, match.params.id, token, apiDispatch]);

  useEffect(() => {
    if (spot === undefined) return;
    if (spot!.purificationPlants === undefined) return;

    setPPlantsNumber(spot!.purificationPlants.length);
  }, [spot, spot?.purificationPlants, apiState]);

  /**
   * TODO: Make a requeest to the api for getting all the plants
   * FIXME: This effect sends us into an inifinte loop of refreshing
   *
   *
   *
   */
  useEffect(() => {
    if (token === undefined) return;
    if (spot === undefined) return;
    if (user.pgapiData === undefined) return;
    if (spot.purificationPlants === undefined) return;
    console.log('PPlant update hook');
    const baseUrl = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${match.params.id}`;

    const actions: IApiAction[] = [];

    spot!.purificationPlants.forEach((plant) => {
      actions.push(
        actionCreator({
          body: {},
          token,
          method: 'GET',
          url: `${baseUrl}/${ApiResources.purificationPlants}/${plant.id}/${ApiResources.measurements}`,
          type: ApiActionTypes.START_API_REQUEST,
          resource: 'pplantMeasurements',
        }),
      );
    });

    if (actions.length > 0) {
      actions.forEach((action) => {
        apiRequest(apiDispatch, action);
      });
    }
  }, [pplantsNumber, user.pgapiData, apiDispatch, match.params.id, token]);

  /**
   * This effect filters out the single spot.
   */
  useEffect(() => {
    if (apiState === undefined) return;
    const filtered = apiState.spots.filter(
      (spot) => spot.id === parseInt(match.params.id, 10),
    );

    if (filtered.length > 0) {
      setSpot(filtered[0]);
    }
  }, [apiState, match.params.id]);

  /**
   * This effect checks if the form is ready to formReadyToRender
   * e.g. if the spot data is already there and it matches the route id
   *
   *
   *
   */
  useEffect(() => {
    if (spot === undefined) return;
    if (spot.id === parseInt(match.params.id!, 10)) {
      setFormReadyToRender(true);
    }
  }, [setFormReadyToRender, spot, match.params.id]);
  /**
   * This effect sorts the models of the spot and get s the last one
   *
   *
   *
   *
   */
  useEffect(() => {
    if (
      spot === undefined ||
      spot.models === undefined ||
      spot.models.length < 1
    ) {
      return;
    }
    const sortedModels = spot.models.sort((a: IObject, b: IObject) => {
      return (
        ((new Date(a.updatedAt) as unknown) as number) -
        ((new Date(b.updatedAt) as unknown) as number)
      );
    });

    const model = sortedModels[sortedModels.length - 1];
    setLastModel(model);
  }, [spot]);

  //
  //
  // ---------RENDERING------------------------
  //
  //
  return (
    <>
      <SpotEditorInfoModal
        isActive={infoShowMode}
        clickHandler={handleInfoShowModeClick}
      />
      {(() => {
        if (basisEditMode === true && spot !== undefined) {
          return (
            <Container>
              {formReadyToRender === true && basisEditMode === true && (
                <SpotEditorBasisData
                  initialSpot={spot}
                  handleEditModeClick={handleBasisEditModeClick}
                  handleInfoShowModeClick={handleInfoShowModeClick}
                />
              )}
            </Container>
          );
        } else if (dataEditMode === true && spot !== undefined) {
          return (
            <Container>
              <SpotEditorMeasurmentsUpload
                initialValues={{
                  // csvFile: undefined,
                  measurements: [],
                  measurementsUrl: spot.apiEndpoints?.measurementsUrl ?? '',
                  globalIrradiance: [],
                  globalIrradianceUrl:
                    spot.apiEndpoints?.globalIrradianceUrl ?? '',
                  discharges: [],
                  dischargesUrl: spot.apiEndpoints?.dischargesUrl ?? '',
                }}
                handleInfoClick={handleInfoShowModeClick}
                handeCloseClick={handleDataEditModeClick}
                spotId={spot.id}
                // schema={measurementsSchema}
                // postData={(data: any) => {
                //   console.log(
                //     'This is the data submitted by the new SpotEditorMeasurmentsUpload Formik component ',
                //     data,
                //   );
                // }}
              ></SpotEditorMeasurmentsUpload>
            </Container>
          );
        } else if (ppDataEditMode === true && spot !== undefined) {
          const initialValues: ISpotEditorPurificationPlantsInitialValues = {
            purificationPlants: spot.purificationPlants
              ? spot.purificationPlants
              : ([{ name: 'foo', id: 1 }] as IPurificationPlant[]),
          };
          return (
            <Container>
              <SpotEditorPurificationPlants
                initialValues={initialValues}
                handeCloseClick={handlePPDataEditModeClick}
                handleInfoClick={handleInfoShowModeClick}
                spotId={spot.id}
              ></SpotEditorPurificationPlants>
            </Container>
          );
        } else {
          return (
            <>
              {apiState.loading === true && spot === undefined && (
                <Container>
                  <h1>
                    {' '}
                    {'Aktualisiere Badestellen Daten'}
                    <Spinner />
                  </h1>
                </Container>
              )}
              {isAuthenticated === true &&
                showNotification === true &&
                spot !== undefined && (
                  <Container>
                    <Banner message={message}></Banner>
                  </Container>
                )}
              {spot !== undefined && (
                <Container>
                  <SpotHeader
                    name={spot.name}
                    nameLong={spot.nameLong}
                    water={spot.water}
                    district={spot.district}
                    isLoading={apiState.loading}
                  />
                </Container>
              )}
              {SpotHr()}
              {isAuthenticated === true && (
                <Container>
                  <SpotButtonBar
                    handlePPEditModeClick={handlePPDataEditModeClick}
                    handleBasisEditModeClick={handleBasisEditModeClick}
                    handleInfoShowModeClick={handleInfoShowModeClick}
                    handleCalibratePredictClick={handleCalibratePredictClick}
                    handleDataEditModeClick={handleDataEditModeClick}
                    ocpuState={ocpuState}
                  />
                </Container>
              )}
              {spot !== undefined && (
                <ContainerNoColumn>
                  <SpotTableBlock
                    title={{
                      title: 'Vorhersage-Modelle',
                      iconType: 'IconCalc',
                    }}
                    Table={() => SpotModelTable(lastModel)}
                  />
                  <SpotTableBlock
                    title={{ title: 'Vorhersage', iconType: 'IconComment' }}
                    Table={() => PredictionTable(spot)}
                  />
                </ContainerNoColumn>
              )}
              <ContainerNoColumn>
                {spot !== undefined && (
                  <SpotTableBlock
                    title={{
                      title: 'letzte E.C./I.C. Messung',
                      iconType: 'IconCSV',
                    }}
                    Table={() => SpotMeasurementsTable(spot)}
                  />
                )}

                {spot !== undefined && (
                  <SpotTableBlock
                    title={{
                      title: 'Mittlere Regenhöhen',
                      iconType: 'IconRain',
                    }}
                    Table={() => RainTable(spot)}
                  ></SpotTableBlock>
                )}
              </ContainerNoColumn>
              <ContainerNoColumn>
                {spot !== undefined && (
                  <SpotTableBlock
                    title={{
                      title: 'letzte Globalstrahlungs Messungen',
                      iconType: 'IconCSV',
                    }}
                    Table={() => (
                      <DefaultTable
                        unit={'PiratenNinjas'}
                        measurements={spot.globalIrradiances}
                      ></DefaultTable>
                    )}
                  ></SpotTableBlock>
                )}
                {spot !== undefined && (
                  <SpotTableBlock
                    title={{
                      title: 'Letzte Abwasser Messungen',
                      iconType: 'IconCSV',
                    }}
                    Table={() => (
                      <DefaultTable
                        unit={'PiratenNinjas'}
                        measurements={spot.discharges}
                      ></DefaultTable>
                    )}
                  ></SpotTableBlock>
                )}
              </ContainerNoColumn>
              {spot !== undefined && (
                <ContainerNoColumn>
                  <SpotTableBlock
                    title={{
                      title: 'Klärwerke',
                      iconType: 'IconIndustry',
                    }}
                    Table={() => (
                      <CollectionWithSubItemTable
                        items={spot.purificationPlants}
                      />
                    )}
                  ></SpotTableBlock>
                  <SpotTableBlock
                    title={{
                      title: 'Generische Messwerte',
                      iconType: 'IconCSV',
                    }}
                    Table={() => <CollectionWithSubItemTable />}
                  ></SpotTableBlock>
                </ContainerNoColumn>
              )}
              {lastModel !== undefined && lastModel.plotfiles !== undefined && (
                <SpotModelPlots
                  plotfiles={lastModel.plotfiles}
                ></SpotModelPlots>
              )}
              <Container>
                {spot !== undefined &&
                  apiState.loading === false &&
                  MapWrapper(mapRef, mapDims, spot)}
              </Container>
              <ContainerNoColumn>
                {spot !== undefined && SpotBasicInfos(spot)}
              </ContainerNoColumn>
              <Container>
                {spot !== undefined && SpotAdditionalTags(spot)}
              </Container>
            </>
          );
        }
      })()}
    </>
  );
};

export default Spot;
