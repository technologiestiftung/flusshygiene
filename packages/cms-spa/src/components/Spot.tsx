import React, { useRef, useEffect, useState } from 'react';

import { APIMountPoints, ApiResources } from '../lib/common/enums';
import { fetchSingleSpot } from '../lib/state/reducers/actions/fetch-get-single-spot';
import {
  IFetchSpotOptions,
  IOcpuStartAction,
  IObject,
  IBathingspot,
  IApiAction,
  ApiActionTypes,
} from '../lib/common/interfaces';
import { RootState } from '../lib/state/reducers/root-reducer';
import { RouteComponentProps } from 'react-router';
import { SpotHeader } from './spot/Spot-Header';
import { useMapResizeEffect } from '../hooks/map-hooks';
import { useSelector, useDispatch } from 'react-redux';
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

// const messageCalibratePredict = {
//   calibrate:
//     'Ihre Kalibrierung wurde gestartet. Abhängig von der Menge an Messwerten kann dies dauern. Bitte kommen Sie in einigen Minuten zurück.',
//   predict:
//     'Ihre Vorhersagegenerierung wurde gestartet. Abhängig von der Menge an Messwerten kann dies dauern. Bitte kommen Sie in einigen Minuten zurück.',
//   model:
//     'Ihre Modelierung wurde gestartet. Dies kann etwas dauern. Bitte kommen Sie in einigen Minuten zurück.',
// };
type RouteProps = RouteComponentProps<{ id: string }>;

export interface IModelInfo {
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

/**
 * This is the component that displays a single spot
 *
 */
const Spot: React.FC<RouteProps> = ({ match }) => {
  const { user, isAuthenticated, getTokenSilently } = useAuth0();
  const [ocpuState, ocpuDispatch] = useOcpu();
  const [apiState, apiDispatch] = useApi();
  const eventSourceState = useEventSource();

  /**
   * Toggles the edit mode (open SpotEditor)
   */
  const handleEditModeClick = () => {
    setEditMode(!editMode);
  };

  /**
   * Handles the click events on the button bar on top for all the calls to middlelayer
   *
   */
  const handleCalibratePredictClick = (event: React.ChangeEvent<any>) => {
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
    // setCalibratePredictSelector(event.currentTarget.id);
    setShowNotification((prevState) => !prevState);
  };
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>('');
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [lastModel, setLastModel] = useState<IObject>();
  const [token, setToken] = useState<string>();
  // const [calibratePredictSelector, setCalibratePredictSelector] = useState<
  // 'calibrate' | 'predict' | 'model' | 'sleep' | undefined
  // >(undefined);
  const [showNotification, setShowNotification] = useState(false);
  const spot = useSelector(
    (state: RootState) => state.detailSpot.spot as IBathingspot,
  );
  const isSingleSpotLoading = useSelector(
    (state: RootState) => state.detailSpot.loading,
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);

  /**
   * Displays event source state
   * FIXME: Just for debuggoing
   */
  useEffect(() => {
    console.log('Event source state change');
    console.log(eventSourceState);
  }, [eventSourceState]);

  /**
   * displays api state
   * FIXME: Just for debugging
   */
  useEffect(() => {
    console.log('apiState', apiState);
  }, [apiState]);

  /**
   * This effect is just for testing putrpose and should be removed
   * Makes a call to the private api
   * FIXME: Just for debugging and testing
   */
  useEffect(() => {
    if (token === undefined) return;
    const action: IApiAction = {
      type: ApiActionTypes.START_API_REQUEST,
      payload: {
        requestType: { type: 'GET', resource: 'ping' },
        url: `${REACT_APP_API_HOST}/${APIMountPoints.v1}`,
        config: {
          method: 'GET',

          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        },
      },
    };
    console.log('run');
    apiRequest(apiDispatch, action);
  }, [token, apiDispatch]);

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
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
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
   * This effect calls the api (still redux) and gets information about a single spot
   *
   * MIGRATE to new context or better just pass down the information we already have from the profile?
   * Might be problematic due to missing information
   *
   *
   *
   */
  useEffect(() => {
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

  /**
   * This effect checks if the form is ready to formReadyToRender
   * e.g. if the spot data is already there and it matches the route id
   *
   *
   *
   */
  useEffect(() => {
    if (spot.id === parseInt(match.params.id!, 10)) {
      setFormReadyToRender(true);
    }
  }, [setFormReadyToRender, spot.id, match.params.id]);
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
    // console.log(spot);

    return (
      <>
        {isAuthenticated === true && showNotification === true && (
          <Container>{Banner(message)}</Container>
        )}
        <Container>
          <SpotHeader
            name={spot.name}
            nameLong={spot.nameLong}
            water={spot.water}
            district={spot.district}
            isLoading={isSingleSpotLoading}
          />
        </Container>
        {SpotHr()}
        {isAuthenticated === true && (
          <Container>
            {SpotButtonBar({
              handleEditModeClick,
              handleCalibratePredictClick,
              ocpuState,
            })}
          </Container>
        )}
        <ContainerNoColumn>
          {SpotTableBlock({
            title: { title: 'Letzte Messung', iconType: 'IconCSV' },
            Table: () => SpotMeasurementsTable(spot),
          })}

          {SpotTableBlock({
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
          {SpotTableBlock({
            title: { title: 'Vorhersage', iconType: 'IconComment' },
            Table: () => PredictionTable(spot),
          })}
        </ContainerNoColumn>
        {lastModel !== undefined && lastModel.plotfiles !== undefined && (
          <SpotModelPlots plotfiles={lastModel.plotfiles}></SpotModelPlots>
        )}
        <Container>
          {isSingleSpotLoading === false && MapWrapper(mapRef, mapDims, spot)}
        </Container>
        <ContainerNoColumn>
          {spot !== undefined && SpotBasicInfos(spot)}
        </ContainerNoColumn>
        <Container>{spot !== undefined && SpotAdditionalTags(spot)}</Container>
      </>
    );
  }
};

export default Spot;
