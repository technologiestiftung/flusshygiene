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
  IGenericInput,
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
// import { Banner, BannerType } from './spot/elements/Spot-Banner';
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
import { SpotEditorMeasurmentsUpload } from './spot/SpotEditor-Measurements';
import { SpotEditorInfoModal } from './spot/elements/SpotEditor-InfoModal';
import { DefaultTable } from './spot/elements/Spot-DefaultMeasurementsTable';
import {
  SpotEditorCollectionWithSubitem,
  ISpotEditorCollectionWithSubItemsInitialValues,
} from './spot/SpotEditor-CollectionWithSubitem';
import { CollectionWithSubItemTable } from './spot/elements/Spot-CollectionWithSubitemsTable';
import { pplantSchema } from '../lib/utils/spot-validation-schema';
// import { MeasurementEditor } from './spot/MeasurementEditor';
/**
 * This is the component that displays a single spot
 *
 */
const Spot: React.FC<RouteProps> = ({ match }) => {
  const { user, isAuthenticated, getTokenSilently } = useAuth0();
  const [ocpuState, ocpuDispatch] = useOcpu();
  const [apiState, apiDispatch] = useApi();
  const eventSourceState = useEventSource();

  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [basisEditMode, setBasisEditMode] = useState(false);
  const [dataEditMode, setDataEditMode] = useState(false);
  const [ppDataEditMode, setPPDataEditMode] = useState(false);
  const [giDataEditMode, setGIDataEditMode] = useState(false);

  // const [tableEditMode, setTableEditMode] = useState(true);
  // const [tableEditData, setTableEditData] = useState<any | undefined>(
  //   undefined,
  // );

  const [infoShowMode, setInfoShowMode] = useState(false);
  const [lastModel, setLastModel] = useState<IObject>();
  const [token, setToken] = useState<string>();

  // const [message, setMessage] = useState<string>('');
  // const [showNotification, setShowNotification] = useState(false);
  // const [bannerType, setBannerType] = useState<BannerType | undefined>(
  // undefined,
  // );

  const [spot, setSpot] = useState<IBathingspot | undefined>(undefined);
  const [pplantsNumber, setPPlantsNumber] = useState<number | undefined>(
    undefined,
  );
  const [gisNumber, setGIsNumber] = useState<number | undefined>(undefined);
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

  const handleGIDataEditModeClick = (e?: React.ChangeEvent<any>) => {
    // if (e) {
    //   e.preventDefault();
    // }
    e?.preventDefault?.();
    setGIDataEditMode(!giDataEditMode);
  };

  // const handleTableEditModeClick = (e?: React.ChangeEvent<any>) => {
  //   e?.preventDefault?.();
  //   setTableEditMode(!tableEditMode);
  // };

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
    // setShowNotification((prevState) => !prevState);
  };

  // const handleBannerClose = (e?: React.ChangeEvent<any>) => {
  //   e?.preventDefault();
  //   setShowNotification(false);
  //   setMessage('');
  // };
  //   ******** ******** ******** ********   ******  **********  ********
  //  /**///// /**///// /**///// /**/////   **////**/////**///  **//////
  //  /**      /**      /**      /**       **    //     /**    /**
  //  /******* /******* /******* /******* /**           /**    /*********
  //  /**////  /**////  /**////  /**////  /**           /**    ////////**
  //  /**      /**      /**      /**      //**    **    /**           /**
  //  /********/**      /**      /******** //******     /**     ********
  //  //////// //       //       ////////   //////      //     ////////
  //
  //
  //
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
  // useEffect(() => {
  //   if (showNotification === false) return;
  //   // const timeout = setTimeout(() => {
  //   //   setShowNotification(false);
  //   // }, 7000);

  //   // return () => {
  //   //   clearTimeout(timeout);
  //   // };
  // }, [showNotification]);

  /**
   * this effect sets the content of the banner based on ocpu data
   *
   */
  // useEffect(() => {
  //   setMessage(JSON.stringify(ocpuState.responses[0]));
  //   setBannerType('normal');
  //   setShowNotification(true);
  // }, [ocpuState]);

  /**
   * This effect sets the current content of the Banner based on event souce data
   *
   */
  // useEffect(() => {
  //   setMessage(JSON.stringify(eventSourceState));
  //   setBannerType('normal');
  //   setShowNotification(true);
  // }, [eventSourceState]);

  // useEffect(() => {
  //   if (apiState.error === undefined) return;
  //   setMessage(JSON.stringify(apiState.error?.error?.message));
  //   setBannerType('error');
  //   setShowNotification(true);
  // }, [apiState.error]);
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

  //    ********  ******** **********
  //   **//////**/**///// /////**///
  //  **      // /**          /**
  // /**         /*******     /**
  // /**    *****/**////      /**
  // //**  ////**/**          /**
  //  //******** /********    /**
  //
  //
  //
  //   ////////  ////////     //
  //      **     **       **
  //     ****   /**      /**
  //    **//**  /**      /**
  //   **  //** /**      /**
  //  **********/**      /**
  // /**//////**/**      /**
  // /**     /**/********/********
  // //      // //////// ////////
  //
  //
  //
  //
  //  ** ********** ******** ****     ****  ********
  // /**/////**/// /**///// /**/**   **/** **//////
  // /**    /**    /**      /**//** ** /**/**
  // /**    /**    /******* /** //***  /**/*********
  // /**    /**    /**////  /**  //*   /**////////**
  // /**    /**    /**      /**   /    /**       /**
  // /**    /**    /********/**        /** ********
  // //     //     //////// //         // ////////

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
    actions.push(
      actionCreator({
        body: {},
        token,
        method: 'GET',
        url: `${baseUrl}/${ApiResources.genericInputs}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: 'genericInputs',
      }),
    );

    if (actions.length > 0) {
      actions.forEach((action) => {
        apiRequest(apiDispatch, action);
      });
    }
  }, [
    spot,
    user.pgapiData,
    match.params.id,
    token,
    apiDispatch,
    apiState.reload,
  ]);

  /**
   * This effect is a trigger to the pplants measurements effect
   */
  useEffect(() => {
    if (spot === undefined) return;
    if (spot!.purificationPlants === undefined) return;

    setPPlantsNumber(spot!.purificationPlants.length);
  }, [spot, apiState]);

  /**
   * This effect takes care of updating the pplants measurements
   *
   */
  useEffect(() => {
    if (token === undefined) return;
    if (spot === undefined) return;
    if (user.pgapiData === undefined) return;
    if (spot.purificationPlants === undefined) return;
    // console.log('PPlant update hook');
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
  }, [
    pplantsNumber,
    user.pgapiData,
    apiDispatch,
    match.params.id,
    token,
    spot,
    apiState.reload,
    apiState.reloadSubItems,
  ]);

  /**
   * This effect is a trigger to the pplants measurements effect
   */
  useEffect(() => {
    if (spot === undefined) return;
    if (spot!.genericInputs === undefined) return;

    setGIsNumber(spot!.genericInputs.length);
  }, [spot, apiState]);

  /**
   * This effect takes care of updating the genericInputs measurements
   *
   */
  useEffect(() => {
    if (token === undefined) return;
    if (spot === undefined) return;
    if (user.pgapiData === undefined) return;
    if (spot.genericInputs === undefined) return;
    // console.log('Gis m update hook');
    const baseUrl = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${match.params.id}`;

    const actions: IApiAction[] = [];

    spot!.genericInputs.forEach((plant) => {
      actions.push(
        actionCreator({
          body: {},
          token,
          method: 'GET',
          url: `${baseUrl}/${ApiResources.genericInputs}/${plant.id}/${ApiResources.measurements}`,
          type: ApiActionTypes.START_API_REQUEST,
          resource: 'gInputMeasurements',
        }),
      );
    });

    if (actions.length > 0) {
      actions.forEach((action) => {
        apiRequest(apiDispatch, action);
      });
    }
  }, [
    gisNumber,
    user.pgapiData,
    apiDispatch,
    match.params.id,
    token,
    spot,
    apiState.reload,
    apiState.reloadSubItems,
  ]);

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
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //  *******   ******** ****     ** *******   ******** *******
  // /**////** /**///// /**/**   /**/**////** /**///// /**////**
  // /**   /** /**      /**//**  /**/**    /**/**      /**   /**
  // /*******  /******* /** //** /**/**    /**/******* /*******
  // /**///**  /**////  /**  //**/**/**    /**/**////  /**///**
  // /**  //** /**      /**   //****/**    ** /**      /**  //**
  // /**   //**/********/**    //***/*******  /********/**   //**
  // //     // //////// //      /// ///////   //////// //     //
  //
  //
  // ---------RENDERING------------------------
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  return (
    <>
      <SpotEditorInfoModal
        isActive={infoShowMode}
        clickHandler={handleInfoShowModeClick}
      />
      {(() => {
        // if (tableEditMode === true && spot !== undefined) {
        //   return (
        //     <MeasurementEditor
        //       resourceType={'measurements'}
        //       handleCloseClick={handleTableEditModeClick}
        //       inData={spot.measurements ? spot.measurements : []}
        //     />
        //   );
        // } else
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
          const initialValues: ISpotEditorCollectionWithSubItemsInitialValues = {
            collection: spot.purificationPlants
              ? spot.purificationPlants
              : ([{ name: '', url: '' }] as IPurificationPlant[]),
          };
          return (
            <Container>
              <SpotEditorCollectionWithSubitem
                validationSchema={pplantSchema}
                resourceType={ApiResources.purificationPlants}
                uploadBoxResourceType={'pplantMeasurements'}
                title={'Klärwerke'}
                initialValues={initialValues}
                handeCloseClick={handlePPDataEditModeClick}
                handleInfoClick={handleInfoShowModeClick}
                spotId={spot.id}
              ></SpotEditorCollectionWithSubitem>
            </Container>
          );
        } else if (giDataEditMode === true && spot !== undefined) {
          const initialValues: ISpotEditorCollectionWithSubItemsInitialValues = {
            collection: spot.genericInputs
              ? spot.genericInputs
              : ([{ name: '', url: '' }] as IGenericInput[]),
          };
          return (
            <Container>
              <SpotEditorCollectionWithSubitem
                validationSchema={pplantSchema}
                resourceType={ApiResources.genericInputs}
                uploadBoxResourceType={'gInputMeasurements'}
                title={'Generische Messwete'}
                initialValues={initialValues}
                handeCloseClick={handleGIDataEditModeClick}
                handleInfoClick={handleInfoShowModeClick}
                spotId={spot.id}
              ></SpotEditorCollectionWithSubitem>
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
              {/* {isAuthenticated === true &&
                showNotification === true &&
                spot !== undefined && (
                  <Container>
                    <Banner
                      message={message}
                      handleClose={handleBannerClose}
                      bannerType={bannerType}
                    ></Banner>
                  </Container>
                )} */}
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
                    handleGIEditModeClock={handleGIDataEditModeClick}
                    ocpuState={ocpuState}
                  />
                </Container>
              )}

              {/**
               *
               *
               *
               *
               *
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               * TABLES
               *
               *
               *
               *
               *
               *
               */}
              {spot !== undefined && (
                <ContainerNoColumn>
                  <SpotTableBlock
                    title={{
                      title: 'Vorhersage-Modelle',
                      iconType: 'IconCalc',
                    }}
                    // data={[1, 2, 3]}
                    Table={() => SpotModelTable(lastModel)}
                    // handleEditClick={() => {
                    //   setTableEditMode(true);
                    // }}
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
                    // handleEditClick={() => {
                    //   setTableEditData(spot.measurements);
                    //   setTableEditMode(true);
                    // }}
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
                    Table={() => (
                      <CollectionWithSubItemTable items={spot.genericInputs} />
                    )}
                  ></SpotTableBlock>
                </ContainerNoColumn>
              )}
              {lastModel !== undefined && lastModel.plotfiles !== undefined && (
                <SpotModelPlots
                  plotfiles={lastModel.plotfiles}
                ></SpotModelPlots>
              )}
              <Container>
                <div ref={mapRef} id='map__container'>
                  {spot !== undefined &&
                    apiState.loading === false &&
                    mapRef !== null && (
                      <MapWrapper mapDims={mapDims} spot={spot} />
                    )}
                </div>
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
