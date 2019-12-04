import React, { useRef, useEffect, useState } from 'react';
import { actionCreator } from '../lib/utils/pgapi-actionCreator';
import { APIMountPoints, ApiResources } from '../lib/common/enums';

import {
  IOcpuStartAction,
  IObject,
  IBathingspot,
  ApiActionTypes,
  RouteProps,
} from '../lib/common/interfaces';

import { SpotHeader } from './spot/Spot-Header';
import { useMapResizeEffect } from '../hooks/map-hooks';
import { SpotEditor } from './spot/SpotEditor';
import { SpotModelPlots } from './spot/Spot-Model-Plots';
import { useAuth0 } from '../lib/auth/react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../lib/config';
import { Container, ContainerNoColumn } from './Container';
import { useOcpu, postOcpu } from '../contexts/opencpu';
import { useEventSource } from '../contexts/eventsource';
import { useApi, apiRequest } from '../contexts/postgres-api';
import { Banner } from './spot/Spot-Banner';
import { SpotButtonBar } from './spot/Spot-ButtonBar';
import { SpotAdditionalTags } from './spot/Spot-AdditionalTags';
import { SpotBasicInfos } from './spot/Spot-BasicInfos';
import { MapWrapper } from './spot/Spot-Map-Wrapper';
import { PredictionTable } from './spot/Spot-PredictionTable';
import { RainTable } from './spot/Spot-RainTable';
import { SpotMeasurementsTable } from './spot/Spot-MeasurementsTable';
import { SpotModelTable } from './spot/Spot-ModelTable';
import { SpotTableBlock } from './spot/Spot-TableBlock';
import { SpotHr } from './spot/Spot-Hr';
import { Spinner } from './util/Spinner';
import { SpotEditorMeasurmentsUpload } from './spot/SpotEditor-Measurments';
import { measurementsSchema } from '../lib/utils/spot-validation-schema';
import { SpotEditorInfoModal } from './spot/SpotEditor-InfoModal';

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
  const [infoShowMode, setInfoShowMode] = useState(false);
  const [lastModel, setLastModel] = useState<IObject>();
  const [token, setToken] = useState<string>();

  const [showNotification, setShowNotification] = useState(false);

  const [spot, setSpot] = useState<IBathingspot | undefined>(undefined);
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
  const handleCalibratePredictClick = (event: React.ChangeEvent<any>) => {
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

  /**
   * This effect gets one bathingspot
   * Follow the crumbs to contexts/postgres-api
   */
  useEffect(() => {
    if (token === undefined) return;
    if (user.pgapiData === undefined) return;

    const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${match.params.id}`;

    const action = actionCreator({
      body: {},
      token,
      method: 'GET',
      url,
      type: ApiActionTypes.START_API_REQUEST,
      resource: 'bathingspot',
    });
    apiRequest(apiDispatch, action);
  }, [token, apiDispatch, match.params.id, user.pgapiData]);

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
                <SpotEditor
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
                  measurementsUrl: '',
                  measurements: [],
                  globalIrradiance: [],
                  globalIrradianceUrl: '',
                  discharges: [],
                  dischargesUrl: '',
                }}
                handleInfoClick={handleInfoShowModeClick}
                handeCloseClick={handleDataEditModeClick}
                schema={measurementsSchema}
                postData={(data: any) => {
                  console.log(
                    'This is the data submitted by the new SpotEditorMeasurmentsUpload Formik component ',
                    data,
                  );
                }}
              ></SpotEditorMeasurmentsUpload>
            </Container>
          );
        } else {
          return (
            <>
              {isAuthenticated === true &&
                showNotification === true &&
                spot !== undefined && <Container>{Banner(message)}</Container>}
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
                  {SpotButtonBar({
                    handleBasisEditModeClick,
                    handleInfoShowModeClick,
                    handleCalibratePredictClick,
                    handleDataEditModeClick,
                    ocpuState,
                  })}
                </Container>
              )}
              <ContainerNoColumn>
                {spot !== undefined &&
                  SpotTableBlock({
                    title: { title: 'Letzte Messung', iconType: 'IconCSV' },
                    Table: () => SpotMeasurementsTable(spot),
                  })}

                {spot !== undefined &&
                  SpotTableBlock({
                    title: {
                      title: 'Mittlere Regenhöhen',
                      iconType: 'IconRain',
                    },
                    Table: () => RainTable(spot),
                  })}
              </ContainerNoColumn>
              <ContainerNoColumn>
                {SpotTableBlock({
                  title: {
                    title: 'Vorhersage-Modelle',
                    iconType: 'IconCalc',
                  },
                  Table: () => SpotModelTable(lastModel),
                })}
                {spot !== undefined &&
                  SpotTableBlock({
                    title: { title: 'Vorhersage', iconType: 'IconComment' },
                    Table: () => PredictionTable(spot),
                  })}
              </ContainerNoColumn>
              {lastModel !== undefined && lastModel.plotfiles !== undefined && (
                <SpotModelPlots
                  plotfiles={lastModel.plotfiles}
                ></SpotModelPlots>
              )}
              <Container>
                {apiState.loading === true && <Spinner />}
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
