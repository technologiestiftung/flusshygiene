export interface IObject {
  [key: string]: any;
}

export interface IMeasurement {
  date: string;
  value: number;
}
export interface IMeasurementConc {
  data: string;
  conc_ec: number;
  conc_ie: number;
}
export interface IApiResponse {
  data: any[];
  success: boolean;
  apiVersion: string;
}

export interface IUser {
  id: number;
  email: string;
  spots: ISpot[];
}

export interface IUserData extends IUser {
  spots: ISpotData[];
}

export interface ISpot {
  id: number;
  apiEndpoints: IApiEndpoints;
  purificationPlants: IPurificationPlant[];
  genericInputs: IGenericInput[];
}
export interface ISpotData extends ISpot {
  apiEndpointsData: IApiEndpointsData;
  purificationPlantsData: IPurificationPlantData[];
  genericInputsData: IGenericInputData[];
}
export interface IApiEndpoints {
  measurementsUrl?: string;
  globalIrradianceUrl?: string;
  dischargesUrl?: string;
}
export interface IApiEndpointsData extends IApiEndpoints {
  [key: string]: any;
  measurementsData: IMeasurementConc[];
  globalIrradianceData?: IMeasurement[];
  dischargesData?: IMeasurement[];
}

export interface IPurificationPlant {
  id: number;
  url: string;
  name: string;
}
export interface IPurificationPlantData extends IPurificationPlant {
  data: IMeasurement[];
}
export interface IGenericInput {
  id: number;
  url: string;
  name: string;
}

export interface IGenericInputData extends IGenericInput {
  data: IMeasurement[];
}
export interface IUserCollection {
  users: IUser[];
}
export interface IDataCollection {
  users: IUserData[];
}
