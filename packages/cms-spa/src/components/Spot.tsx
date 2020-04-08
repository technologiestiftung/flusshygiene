import React, { useRef, useEffect, useState } from "react";
import { actionCreator } from "../lib/utils/pgapi-actionCreator";
import { APIMountPoints, ApiResources } from "../lib/common/enums";
import Cookies from "js-cookie";
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
  RequestResourceTypes,
} from "../lib/common/interfaces";

import { SpotHeader } from "./spot/elements/Spot-Header";
import { useMapResizeEffect } from "../hooks/map-hooks";
import { SpotEditorBasisData } from "./spot/SpotEditor-Basis-Data";
import { SpotModelPlots } from "./spot/elements/Spot-Model-Plots";
import { useAuth0 } from "../lib/auth/react-auth0-wrapper";
import { REACT_APP_API_HOST } from "../lib/config";
import { Container, ContainerNoColumn } from "./Container";
import { useOcpu, postOcpu } from "../contexts/opencpu";
import { useEventSource } from "../contexts/eventsource";
import { useApi, apiRequest } from "../contexts/postgres-api";
import { useMessages } from "../contexts/messages";
import { useHelpDesk } from "../contexts/helpdesk";
// import { Banner } from './spot/elements/Banner';
import { SpotButtonBar } from "./spot/elements/Spot-ButtonBar";
import { SpotAdditionalTags } from "./spot/elements/Spot-AdditionalTags";
import { SpotBasicInfos } from "./spot/elements/Spot-BasicInfos";
import { MapWrapper } from "./spot/elements/Spot-Map-Wrapper";
import { PredictionTable } from "./spot/elements/Spot-PredictionTable";
import { RainTable } from "./spot/elements/Spot-RainTable";
import { SpotMeasurementsTable } from "./spot/elements/Spot-MeasurementsTable";
import { SpotModelTable } from "./spot/elements/Spot-ModelTable";
import { SpotTableBlock } from "./spot/elements/Spot-TableBlock";
import { SpotHr } from "./spot/elements/Spot-Hr";
import { Spinner } from "./util/Spinner";
import { SpotEditorMeasurmentsUpload } from "./spot/SpotEditor-Measurements";
import { SpotEditorInfoModal } from "./spot/elements/SpotEditor-InfoModal";
import { DefaultTable } from "./spot/elements/Spot-DefaultMeasurementsTable";
import {
  SpotEditorCollectionWithSubitem,
  ISpotEditorCollectionWithSubItemsInitialValues,
} from "./spot/SpotEditor-CollectionWithSubitem";
import { CollectionWithSubItemTable } from "./spot/elements/Spot-CollectionWithSubitemsTable";
import { pplantGiSchema } from "../lib/utils/spot-validation-schema";
import { MeasurementEditor } from "./spot/measurement-editor/editor";
import { hasAutoData } from "../lib/utils/has-autodata-url";
import { PublicData } from "./spot/elements/Spot-Public-Data";
// import { MeasurementEditor } from './spot/MeasurementEditor';
/**
 * This is the component that displays a single spot
 *
 */
const Spot: React.FC<RouteProps> = ({ match }) => {
  const { user, isAuthenticated, getTokenSilently } = useAuth0();
  const [ocpuState, ocpuDispatch] = useOcpu();
  const [apiState, apiDispatch] = useApi();
  const [, messageDispatch] = useMessages();
  const [, helpDeskDispatch] = useHelpDesk();
  const eventSourceState = useEventSource();

  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [basisEditMode, setBasisEditMode] = useState(false);
  const [dataEditMode, setDataEditMode] = useState(false);

  const [uploadType, setUploadType] = useState<
    "measurements" | "discharges" | "globalIrradiances" | undefined
  >(undefined);

  const [ppDataEditMode, setPPDataEditMode] = useState(false);
  const [giDataEditMode, setGIDataEditMode] = useState(false);

  const [tableEditMode, setTableEditMode] = useState(true);
  const [tableEditData, setTableEditData] = useState<any[] | undefined>([]);
  const [tableHeaderTitle, setTableHeaderTitle] = useState<string | undefined>(
    undefined,
  );
  const [infoShowMode, setInfoShowMode] = useState(false);
  const [lastModel, setLastModel] = useState<IObject>();
  const [token, setToken] = useState<string>();
  const [tableEditDataType, setTableEditDataType] = useState<
    RequestResourceTypes | undefined
  >(undefined);
  const [tableEditSubItemId, setTableEditSubItemId] = useState<
    number | undefined
  >(undefined);

  // const [message, setMessage] = useState<string>('');
  // const [showNotification, setShowNotification] = useState(false);
  // const [bannerType, setBannerType] = useState<BannerType | undefined>(
  //   undefined,
  // );

  const [spot, setSpot] = useState<IBathingspot | undefined>(undefined);
  // const [models, setModels] = useState<IModel[] | undefined>(undefined);
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

  const handleTableEditModeClick = (e?: React.ChangeEvent<any>) => {
    e?.preventDefault?.();
    setTableEditMode(!tableEditMode);
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
      case "sleep":
      case "predict":
      case "model":
      case "calibrate":
        {
          let body: { spot_id?: number; user_id?: any; seconds?: number };
          body = {
            spot_id: spot.id,
            user_id: user.pgapiData.id,
          };
          if (event.currentTarget.id === "sleep") {
            body = { seconds: 5 };
          }
          const action: IOcpuStartAction = {
            type: "START_OCPU_REQUEST",
            payload: {
              url: `/middlelayer/${event.currentTarget.id}`,
              processingType: event.currentTarget.id,
              config: {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body),
              },
            },
          };
          postOcpu(ocpuDispatch, action);
        }
        break;
      default:
        throw new Error("Target for button not defined");
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

  // useEffect(() => {
  //   messageDispatch({
  //     type: 'SET_MESSAGE',
  //     payload: { message: 'Hello World', type: 'warning' },
  //   });
  // }, [messageDispatch]);
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

  useEffect(() => {
    if (!spot) return;
    // eslint-disable-next-line no-console
    console.log(spot);
    helpDeskDispatch({ type: "SET_SPOT", payload: spot });
  }, [spot, helpDeskDispatch]);
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
  useEffect(() => {
    // console.log(ocpuState.responses, 'ucpu response');

    ocpuState.responses.forEach((elem) => {
      if (elem.success !== undefined && elem.message !== undefined) {
        messageDispatch({
          type: "ADD_MESSAGE",
          payload: {
            message: String(elem.message),
            type: elem.success === true ? "normal" : "error",
          },
        });
      }
    });
    // setMessage(JSON.stringify(ocpuState.responses[0]));
    // setBannerType('normal');
    // setShowNotification(true);
  }, [ocpuState.responses, messageDispatch]);

  useEffect(() => {
    // console.log(apiState.error, 'api errpr');

    if (apiState.error === undefined) return;

    messageDispatch({
      type: "ADD_MESSAGE",
      payload: {
        message: String(apiState.error.message),
        type: "error",
      },
    });

    // setMessage(JSON.stringify(ocpuState.responses[0]));
    // setBannerType('normal');
    // setShowNotification(true);
  }, [apiState.error, messageDispatch]);

  /**
   * This effect sets the current content of the Banner based on event souce data
   *
   */
  useEffect(() => {
    // console.log(eventSourceState.events, 'event source');
    const cookieContent = Cookies.get("flusshygiene");
    let sessionId = "";
    if (cookieContent !== undefined) {
      const decodedCookie = decodeURI(cookieContent);
      // const id = decodedCookies
      // eslint-disable-next-line no-console
      // console.log(decodedCookie);
      const regres = /:(.*?)\./.exec(decodedCookie);
      // console.log(regres);
      if (regres !== null) {
        sessionId = regres[1];
      }
    }
    if (eventSourceState.events.length > 0) {
      // const str = JSON.stringify(eventSourceState.events);
      // const message: string[] =
      eventSourceState.events.forEach((event) => {
        if (sessionId !== event.sessionID) {
          return;
        }
        if (event.hasOwnProperty("event") && event.event === "response") {
          // console.log(event);
          if (event.hasOwnProperty("payload")) {
            if (event.payload.hasOwnProperty("message")) {
              if (Array.isArray(event.payload.message)) {
                const messages = event.payload.message as string[];
                messages.forEach((message) => {
                  messageDispatch({
                    type: "ADD_MESSAGE",
                    payload: {
                      message,
                      type: /error/gim.test(message) ? "error" : "normal",
                    },
                  });
                });
                // return event.payload.message[0];
              } else {
                // return event.payload.message;
                messageDispatch({
                  type: "ADD_MESSAGE",
                  payload: {
                    message: event.payload.message as string,
                    type: /error/gim.test(event.payload.message)
                      ? "error"
                      : "normal",
                  },
                });
              }
            }
          }
        }
        // return '';
      });

      // messageDispatch({
      //   type: 'ADD_MESSAGE',
      //   payload: {
      //     message: message.join('\n'),
      //     type: /error/gim.test(str) ? 'error' : 'normal',
      //   },
      // });
    }
    // setMessage(JSON.stringify(eventSourceState));
    // setBannerType('normal');
    // setShowNotification(true);
  }, [eventSourceState, messageDispatch]);

  useEffect(() => {
    if (apiState.error === undefined) return;
    messageDispatch({
      type: "ADD_MESSAGE",
      payload: {
        message: JSON.stringify(apiState.error?.error?.message),
        type: "error",
      },
    });
    // setMessage(JSON.stringify(apiState.error?.error?.message));
    // setBannerType('error');
    // setShowNotification(true);
  }, [apiState.error, messageDispatch]);
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
        method: "GET",
        url: baseUrl,
        type: ApiActionTypes.START_API_REQUEST,
        resource: "bathingspot",
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
        method: "GET",
        url: `${baseUrl}/${ApiResources.measurements}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: "measurements",
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: "GET",
        url: `${baseUrl}/${ApiResources.models}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: "models",
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: "GET",
        url: `${baseUrl}/${ApiResources.predictions}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: "predictions",
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: "GET",
        url: `${baseUrl}/${ApiResources.globalIrradiances}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: "globalIrradiances",
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: "GET",
        url: `${baseUrl}/${ApiResources.discharges}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: "discharges",
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: "GET",
        url: `${baseUrl}/${ApiResources.rains}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: "rains",
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: "GET",
        url: `${baseUrl}/${ApiResources.purificationPlants}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: "purificationPlants",
      }),
    );
    actions.push(
      actionCreator({
        body: {},
        token,
        method: "GET",
        url: `${baseUrl}/${ApiResources.genericInputs}`,
        type: ApiActionTypes.START_API_REQUEST,
        resource: "genericInputs",
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
    if (spot.purificationPlants === undefined) return;

    setPPlantsNumber(spot.purificationPlants.length);
  }, [spot, apiState.reloadSubItems]);

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

    spot.purificationPlants.forEach((plant) => {
      actions.push(
        actionCreator({
          body: {},
          token,
          method: "GET",
          url: `${baseUrl}/${ApiResources.purificationPlants}/${plant.id}/${ApiResources.measurements}`,
          type: ApiActionTypes.START_API_REQUEST,
          resource: "pplantMeasurements",
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
    if (spot.genericInputs === undefined) return;

    setGIsNumber(spot.genericInputs.length);
  }, [spot, apiState.reloadSubItems]);

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

    spot.genericInputs.forEach((plant) => {
      actions.push(
        actionCreator({
          body: {},
          token,
          method: "GET",
          url: `${baseUrl}/${ApiResources.genericInputs}/${plant.id}/${ApiResources.measurements}`,
          type: ApiActionTypes.START_API_REQUEST,
          resource: "gInputMeasurements",
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
   * Move model into own variable
   */
  // useEffect(() => {
  //   if (spot === undefined) return;
  //   if (spot.models === undefined) return;
  //   setModels(spot.models);
  // }, [spot]);
  /**
   * This effect sorts the models of the spot and get s the last one
   *
   *
   *
   *
   */
  useEffect(() => {
    if (spot === undefined || spot.models === undefined) {
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
  }, [spot, spot?.models]); // eslint-disable-line
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
  // console.log(spot);

  return (
    <>
      {/* <MessageProvider> */}
      <SpotEditorInfoModal
        isActive={infoShowMode}
        clickHandler={handleInfoShowModeClick}
      />
      {(() => {
        if (
          tableEditMode === true &&
          spot !== undefined &&
          tableEditData !== undefined &&
          tableEditDataType !== undefined
        ) {
          // 888888    db    88""Yb 88     888888
          //   88     dPYb   88__dP 88     88__
          //   88    dP__Yb  88""Yb 88  .o 88""
          //   88   dP""""Yb 88oodP 88ood8 888888
          // 888888 8888b.  88 888888  dP"Yb  88""Yb
          // 88__    8I  Yb 88   88   dP   Yb 88__dP
          // 88""    8I  dY 88   88   Yb   dP 88"Yb
          // 888888 8888Y"  88   88    YbodP  88  Yb

          return (
            <MeasurementEditor
              spotApiEndpoints={spot.apiEndpoints}
              setEditMode={setTableEditMode}
              spotId={spot.id}
              resourceType={tableEditDataType}
              handleCloseClick={handleTableEditModeClick}
              inData={tableEditData}
              headerTitle={tableHeaderTitle}
              subItemId={tableEditSubItemId}
              handleCalibratePredictClick={handleCalibratePredictClick}
              setDataEditMode={() => {
                setTableEditMode(false);
                setDataEditMode(true);
              }}
            />
          );
        } else if (basisEditMode === true && spot !== undefined) {
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
                uploadType={uploadType}
                initialValues={{
                  // csvFile: undefined,
                  measurements: [],
                  measurementsUrl: spot.apiEndpoints?.measurementsUrl ?? "",
                  globalIrradiance: [],
                  globalIrradianceUrl:
                    spot.apiEndpoints?.globalIrradianceUrl ?? "",
                  discharges: [],
                  dischargesUrl: spot.apiEndpoints?.dischargesUrl ?? "",
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
              : ([{ name: "", url: "" }] as IPurificationPlant[]),
          };
          return (
            <Container>
              <SpotEditorCollectionWithSubitem
                validationSchema={pplantGiSchema}
                resourceType={ApiResources.purificationPlants}
                uploadBoxResourceType={"pplantMeasurements"}
                title={"Klärwerke"}
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
              : ([{ name: "", url: "" }] as IGenericInput[]),
          };
          return (
            <Container>
              <SpotEditorCollectionWithSubitem
                validationSchema={pplantGiSchema}
                resourceType={ApiResources.genericInputs}
                uploadBoxResourceType={"gInputMeasurements"}
                title={"Generische Messwete"}
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
                    {" "}
                    {"Aktualisiere Badestellen Daten"}
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
                    editButtonText={"Daten bearbeiten"}
                    title={{
                      title: "Kalibrierung Vorhersagemodelle",
                      iconType: "IconCalc",
                    }}
                    hasData={spot.models && spot.models.length > 0}
                    handleEditClick={() => {
                      setTableEditData(spot.models);
                      setTableEditMode(true);
                      setTableEditDataType("models");
                      setTableHeaderTitle("Kalibrierung Vorhersagemodelle");
                    }}
                    Table={() => SpotModelTable(lastModel)}
                  />
                  <SpotTableBlock
                    editButtonText={"Daten bearbeiten"}
                    title={{ title: "Vorhersage", iconType: "IconComment" }}
                    hasData={spot.predictions && spot.predictions.length > 0}
                    handleEditClick={() => {
                      setTableEditData(spot.predictions);
                      setTableEditMode(true);
                      setTableEditDataType("predictions");
                      setTableHeaderTitle("Vorhersage");
                    }}
                    Table={() => PredictionTable(spot)}
                  />
                </ContainerNoColumn>
              )}
              <ContainerNoColumn>
                {spot !== undefined && (
                  <SpotTableBlock
                    editButtonText={"Daten bearbeiten"}
                    title={{
                      title: "Eingangsdaten: Mikrobiologie",
                      iconType: "IconCSV",
                    }}
                    hasData={spot.measurements && spot.measurements.length > 0}
                    Table={() => SpotMeasurementsTable(spot)}
                    handleEditClick={() => {
                      setTableEditData(spot.measurements);
                      setTableEditMode(true);
                      setTableEditDataType("measurements");
                      setTableHeaderTitle(
                        `Eingangsdaten: Mikrobiologie || ${hasAutoData(
                          spot.apiEndpoints?.measurementsUrl !== undefined,
                        )}`,
                      );
                      setUploadType("measurements");
                    }}
                  />
                )}

                {spot !== undefined && (
                  <SpotTableBlock
                    editButtonText={"Daten bearbeiten"}
                    title={{
                      title: "Eingangsdaten: Regenradar",
                      iconType: "IconRain",
                    }}
                    hasData={spot.rains && spot.rains.length > 0}
                    Table={() => RainTable(spot)}
                    handleEditClick={() => {
                      setTableEditData(spot.rains);
                      setTableEditMode(true);
                      setTableEditDataType("rains");
                      setTableHeaderTitle("Eingangsdaten: Regenradar");
                    }}
                  ></SpotTableBlock>
                )}
              </ContainerNoColumn>
              <ContainerNoColumn>
                {spot !== undefined && (
                  <SpotTableBlock
                    editButtonText={"Daten bearbeiten"}
                    title={{
                      title: `Eingangsdaten: Globalstrahlung`,
                      iconType: "IconCSV",
                    }}
                    hasData={
                      spot.globalIrradiances &&
                      spot.globalIrradiances.length > 0
                    }
                    handleEditClick={() => {
                      setTableEditData(spot.globalIrradiances);
                      setTableEditMode(true);
                      setTableEditDataType("globalIrradiances");
                      setTableHeaderTitle(
                        `Eingangsdaten: Globalstrahlung || ${hasAutoData(
                          spot.apiEndpoints?.globalIrradianceUrl !== undefined,
                        )}`,
                      );
                      setUploadType("globalIrradiances");
                    }}
                    Table={() => (
                      <DefaultTable
                        unit={"W/m²"}
                        measurements={spot.globalIrradiances}
                        hasAutoData={
                          spot.apiEndpoints?.globalIrradianceUrl !== undefined
                        }
                      ></DefaultTable>
                    )}
                  ></SpotTableBlock>
                )}
                {spot !== undefined && (
                  <SpotTableBlock
                    editButtonText={"Daten bearbeiten"}
                    title={{
                      title: "Eingangsdaten: Durchfluss",
                      iconType: "IconCSV",
                    }}
                    hasData={spot.discharges && spot.discharges.length > 0}
                    handleEditClick={() => {
                      setTableEditData(spot.discharges);
                      setTableEditMode(true);
                      setTableEditDataType("discharges");
                      setTableHeaderTitle(
                        `Eingangsdaten: Durchfluss || ${hasAutoData(
                          spot.apiEndpoints?.dischargesUrl !== undefined,
                        )}`,
                      );
                      setUploadType("discharges");
                    }}
                    Table={() => (
                      <DefaultTable
                        unit={" m³/s"}
                        measurements={spot.discharges}
                        hasAutoData={
                          spot.apiEndpoints?.dischargesUrl !== undefined
                        }
                      ></DefaultTable>
                    )}
                  ></SpotTableBlock>
                )}
              </ContainerNoColumn>
              {spot !== undefined && (
                <ContainerNoColumn>
                  <SpotTableBlock
                    editButtonText={"Klärwerke anlegen"}
                    title={{
                      title: "Eingangsdaten: Klärwerk",
                      iconType: "IconIndustry",
                    }}
                    hasData={
                      spot.purificationPlants &&
                      spot.purificationPlants.length > 0
                    }
                    handleEditClick={() => {
                      setTableEditData(spot.purificationPlants);
                      setTableEditMode(true);
                      setTableEditDataType("purificationPlants");
                      setTableHeaderTitle("Eingangsdaten: Klärwerk");
                    }}
                    Table={() => (
                      <CollectionWithSubItemTable
                        editButtonText={"Editieren"}
                        setData={setTableEditData}
                        setTitle={setTableHeaderTitle}
                        setSubItemId={setTableEditSubItemId}
                        handleEditClick={(e) => {
                          e?.preventDefault();
                          setTableEditMode(true);
                          setTableEditDataType("pplantMeasurements");
                        }}
                        items={spot.purificationPlants}
                      />
                    )}
                  ></SpotTableBlock>
                  <SpotTableBlock
                    title={{
                      title: "Eingangsdaten: Generisch",
                      iconType: "IconCSV",
                    }}
                    editButtonText={"Generische Daten anlegen"}
                    hasData={
                      spot.genericInputs && spot.genericInputs.length > 0
                    }
                    handleEditClick={() => {
                      setTableEditData(spot.genericInputs);
                      setTableEditMode(true);
                      setTableEditDataType("genericInputs");
                      setTableHeaderTitle("Generische Messwerte");
                    }}
                    Table={() => (
                      <CollectionWithSubItemTable
                        editButtonText={"Editieren"}
                        setData={setTableEditData}
                        setTitle={setTableHeaderTitle}
                        setSubItemId={setTableEditSubItemId}
                        handleEditClick={(e) => {
                          e?.preventDefault();
                          setTableEditMode(true);
                          setTableEditDataType("gInputMeasurements");
                        }}
                        items={spot.genericInputs}
                      />
                    )}
                  ></SpotTableBlock>
                </ContainerNoColumn>
              )}
              {spot && SpotHr()}
              {spot && (
                <Container>
                  <h3 className="is-title is-3">Öffentlicher Zugriff</h3>
                  {spot.isPublic === false ? (
                    <div className="content">
                      {" "}
                      <p>
                        <em>
                          Der öffentlicher Lesezugriff ist deaktiviert. Um die
                          Daten öffentlich einsehbar zu machen, aktivieren Sie
                          diesen in den "Basis Daten".
                        </em>
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="content">
                        <p>
                          Für den Zugriff auf diese Daten ist ein limit von 100
                          Anfragen innerhalb von 5 Minuten gesetzt. Wenn Sie
                          mehr Zugriffe benötigen, wenden Sie sich an die
                          Administratoren. Einzelne Datenpunkte können über ihre
                          entsprechende <code>id</code> abgerufen werden. Zum
                          Beispiel:
                        </p>
                        <pre>
                          {`${REACT_APP_API_HOST}/${APIMountPoints.v1}/public/${ApiResources.bathingspots}/${spot.id}/${ApiResources.measurements}/1`}
                          <code></code>
                        </pre>
                      </div>
                      <PublicData
                        spotId={spot.id}
                        genericInputs={spot.genericInputs}
                        purificationPlants={spot.purificationPlants}
                      ></PublicData>
                    </>
                  )}
                </Container>
              )}
              {lastModel !== undefined && lastModel.plotfiles !== undefined && (
                <SpotModelPlots
                  plotfiles={lastModel.plotfiles}
                ></SpotModelPlots>
              )}
              <Container>
                <div ref={mapRef} id="map__container">
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
      {/* </MessageProvider> */}
    </>
  );
};

export default Spot;
