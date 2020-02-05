import { FormikHelpers } from 'formik';
import { RouteComponentProps } from 'react-router';
import * as Yup from 'yup';
export interface IObject {
  [key: string]: any;
}

export interface IFetchHeaders {
  'content-type': 'application/json';
  Authorization: string;
}
export interface IFetchOptions {
  headers: IObject;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
  signal?: AbortSignal;
}
export interface IFetchSpotOptions extends IFetchOptions {
  url: string;
  update?: boolean;
  updateSingle?: boolean;
  updateAll?: boolean;
}

export interface IBathingspotApiEndpoints {
  measurementsUrl?: string;
  dischargesUrl?: string;
  globalIrradianceUrl?: string;
}
export interface IBathingspot {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  version?: number;
  hasPrediction?: boolean;
  detailId?: number;
  oldId?: number;
  measuringPoint?: string;
  name: string;
  nameLong?: string;
  nameLong2?: string;
  water?: string;
  district?: string;
  street?: string;
  postalCode?: number;
  isPublic: boolean;
  city?: string;
  website?: string;
  cyanoPossible?: boolean;
  healthDepartment?: string;
  healthDepartmentAddition?: string;
  healthDepartmentStreet?: string;
  healthDepartmentPostalCode?: number;
  healthDepartmentCity?: string;
  healthDepartmentMail?: string;
  healthDepartmentPhone?: string;
  waterRescueThroughDLRGorASB?: boolean;
  waterRescue?: string;
  lifeguard?: boolean;
  hasDisabilityAccesableEntrence?: boolean;
  disabilityAccess?: boolean;
  disabilityAccessBathrooms?: boolean;
  restaurant?: boolean;
  snack?: boolean;
  parkingSpots?: boolean;
  bathrooms?: boolean;
  bathroomsMobile?: boolean;
  dogban?: boolean;
  lastClassification?: string;
  image?: string;
  apiEndpoints?: IBathingspotApiEndpoints;
  state?: string;
  location?: IGeoJsonGeometry;
  area?: IGeoJsonGeometry;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  user?: IObject;
  userId?: number;
  predictions?: IPrediction[];
  models?: IModel[];
  measurements?: IMeasurement[];
  rawModelData?: IObject[];
  region?: IObject;
  rains?: IDefaultMeasurement[];
  globalIrradiances?: IDefaultMeasurement[];
  purificationPlants?: IPurificationPlant[];
  discharges?: IDefaultMeasurement[];
  genericInputs?: IGenericInput[];
  influencePurificationPlant?: 'yes' | 'no' | 'unknown';
  influenceCombinedSewerSystem?: 'yes' | 'no' | 'unknown';
  influenceRainwater?: 'yes' | 'no' | 'unknown';
  influenceAgriculture?: 'yes' | 'no' | 'unknown';
}

export interface IDefaultResource {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface IModel extends IDefaultResource {
  rmodel?: string;
  parameter: 'conc_ie' | 'conc_ec';
  rmodelfiles?: IObject[];
  plotfiles?: IObject[];
  comment?: string;
  evaluation?: string;
}
export interface IPurificationPlant {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  url?: string;
  measurements?: IDefaultMeasurement[];
}
export interface IGenericInput {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  url?: string;
  measurements?: IDefaultMeasurement[];
}
export interface ICollectionWithSubitem {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  url?: string;
  measurements?: IDefaultMeasurement[];
}

export interface IPrediction {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  date: Date;
  prediction: string;
  comment?: string;
  percentile2_5?: number;
  percentile50?: number;
  percentile90?: number;
  percentile95?: number;
  percentile97_5?: number;
  credibleInterval2_5?: number;
  credibleInterval97_5?: number;
}
export interface IDefaultMeasurement {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  date: Date;
  dateTime?: Date;
  value: number;
  comment?: string;
}
// export interface IDateOptions {
//     day: 'numeric',
//     month: 'short',
//     weekday: 'short',
//     year: 'numeric',
// }
export interface IBathingspotExtend extends IBathingspot {
  csvFile?: File;
}

export interface ICSVValidationErrorRes {
  row: number;
  message: string;
}

export interface IBathingspotMeasurement {
  date?: Date;
  conc_ec?: number;
  conc_ec_txt?: string;
  oldId?: number;
  detailId?: number;
  conc_ie?: number;
  conc_ie_txt?: string;
  temp?: number;
  algen?: boolean;
  cb?: number;
  sichtTxt?: string;
  tempTxt?: string;
  algenTxt?: string;
  bsl?: string;
  state?: string;
  wasserqualitaet?: number;
  wasserqualitaetTxt?: string;
}

// redux state

export interface IAction {
  type: string;
  payload?: any;
}

// Forms

export interface IFormBuildData {
  type: 'text' | 'number' | 'checkbox' | 'select' | 'email';
  name: string;
  label: string;
  value?: boolean | string;
  options?: IFormOptions[];
  handleChange?: (event: any) => void;
}

export interface IFormOptions {
  text: string;
  value: string;
}

export interface IGeoJsonGeometry {
  coordinates: any[];
  type: 'Point' | 'Polygon';
}
export interface IGeoJsonFeature {
  type: 'Feature';
  geometry: IGeoJsonGeometry;
  properties?: {
    [key: string]: any;
  };
}
export interface IGeoJson {
  type: 'FeatureCollection';
  features: IGeoJsonFeature[];
}

export interface IMapsProps {
  width: number;
  height: number;
  data: IBathingspot | (IBathingspot | undefined)[] | undefined;
  zoom?: number;
  lat?: number;
  lon?: number;
  selectedIndex?: number;
}

export interface IMapsEditorProps extends IMapsProps {
  editMode: MapEditModes;
  activeEditor?: MapEditors;
  newSpot?: boolean;
  defaultFormikSetFieldValues: FormikHelpers<
    IBathingspotExtend
  >['setFieldValue'];
  handleUpdates: (
    e: React.ChangeEvent<any>,
    location?: IGeoJsonGeometry,
    area?: IGeoJsonGeometry,
  ) => void;
}

export type QType = 'verhandlung' | 'infrastruktur';
export interface IAnswer {
  text: string;
  colorText: 'grün' | 'gelb' | 'orange' | 'türkis' | 'rot';
  additionalText: string;
  id: string;
  weight: number;
  answer?: string;
  checked?: boolean;
  possibility?: number;
  qType?: QType;
  reportAddInfo: string;
}

// postgres api

export type RequestTypes = 'POST' | 'GET' | 'PUT' | 'DELETE';
export type RequestResourceTypes =
  | 'bathingspot'
  | 'bathingspots'
  | 'rains'
  | 'measurements'
  | 'globalIrradiances'
  | 'discharges'
  | 'predictions'
  | 'user'
  | 'users'
  | 'models'
  | 'ping'
  | 'purificationPlants'
  | 'pplantMeasurements'
  | 'gInputMeasurements'
  | 'genericInputs';

export interface IApiActionRequestType {
  type: RequestTypes;
  resource: RequestResourceTypes;
}
interface IApiResponse {
  data: IObject[];
  success: boolean;
  truncated: boolean;
  apiVersion: string;
  message: string;
}

export interface IApiActionPayload {
  url: string;
  requestType: IApiActionRequestType;
  response?: IApiResponse;
  config?: RequestInit;
  error?: Error;
  [key: string]: any;
}

export interface IApiFinishedActionPayload extends IApiActionPayload {
  response: IApiResponse;
}

export enum ApiActionTypes {
  START_API_REQUEST = 'START_API_REQUEST',
  FINISH_API_REQUEST = 'FINISH_API_REQUEST',
  FAIL_API_REQUEST = 'FAIL_API_REQUEST',
}
export interface IApiAction {
  type: ApiActionTypes;
  payload: IApiActionPayload;
}
export interface IApiActionFinished extends IApiAction {
  payload: IApiFinishedActionPayload;
}
// interface IUser{
//   [key: string]: any;
// }
export interface IApiState {
  spots: IBathingspot[];
  reload: number;
  reloadSubItems: number;
  sessionId?: string;
  currentSpot?: IBathingspot;

  loading: boolean;
  truncated: boolean;
  error?: IObject;
}

// ocpe context interfaces

export type OcpuDispatchTypes =
  | 'START_OCPU_REQUEST'
  | 'FINISH_OCPU_REQUEST'
  | 'FAIL_OCPU_REQUEST';

export interface IOcpuAction {
  type: OcpuDispatchTypes;
  payload?: {
    [key: string]: any;
  };
}
export interface IOcpuStartAction extends IOcpuAction {
  payload: {
    url: string;
    config: RequestInit;
    processingType: OCpuProcessing;
    //  {
    //   method: string;
    //   headers: { [key: string]: any };
    //   body: string;
    // };
  };
}

export interface IOcpuFinishAction extends IOcpuAction {
  payload: {
    response: Response;
  };
}

export interface IOcpuFailAction extends IOcpuAction {
  payload: {
    error: {
      [key: string]: any;
    };
  };
}

type OCpuProcessing = 'predict' | 'model' | 'calibrate' | undefined;
export interface IOcpuState {
  [key: string]: any;
  processing: OCpuProcessing;
  sessionId: string;
  responses: any[];
  errors: any[];
}

/**
 * For table display in spot.tsx
 */
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

export interface IMeasurementsUploadBox {
  title: string;
  unboxed?: boolean;
  hasNoUrlField?: boolean;
  addionalClassNames?: string;
  // setCSVValidationErrors: React.Dispatch<
  //   React.SetStateAction<ICSVValidationErrorRes[]>
  // >;
  // setParsingErrors: React.Dispatch<
  //   React.SetStateAction<ParseError[] | undefined>
  // >;
  fieldNameFile: string;
  fieldNameUrl: string;
  type: MeasurementTypes;
  props: any;
  schema: Yup.ObjectSchema<
    Yup.Shape<
      object,
      {
        date: Date;
        [key: string]: any;
      }
    >
  >;
}

export interface IMeasurement {
  Date: string;
  [key: string]: any;
}

export interface IMeasurmentsUploadInitialValues {
  // csvFile?: File;
  // url?: string;
  measurementsUrl: string;
  measurements: IMeasurement[];
  globalIrradiance: IMeasurement[];
  globalIrradianceUrl: string;
  discharges: IMeasurement[];
  dischargesUrl: string;
}

// ╔╦╗┬ ┬┌─┐┌─┐┌─┐
//  ║ └┬┘├─┘├┤ └─┐
//  ╩  ┴ ┴  └─┘└─┘

export type MeasurementTypes =
  | 'measurements'
  | 'discharges'
  | 'globalIrradiances'
  | 'pplantMeasurements'
  | 'gInputMeasurements';
export type ClickHandler = (event: React.ChangeEvent<any>) => void;
export type MapEditors = 'area' | 'location';
export type MapEditModes =
  | 'modify'
  | 'view'
  | 'drawPoint'
  | 'drawPolygon'
  | 'translate';
export type MapActiveEditor = 'area' | 'location' | undefined;

export type ColorNames = 'grün' | 'gelb' | 'orange' | 'türkis' | 'rot';

/**
 * Properties of route
 * currently only the match string from the url
 */
export type RouteProps = RouteComponentProps<{ id: string }>;

export type ClickFunction = (event?: React.ChangeEvent<any>) => void;
