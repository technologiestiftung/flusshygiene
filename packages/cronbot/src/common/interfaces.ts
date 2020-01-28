import { GenericTypeDE, ReportType } from "./types";
// DB
export interface IUser {
  id: number;
  email: string;
}

export interface Spot {
  spotId: number;
  spotName: string;
  userId: number;
  email: string;
  apiEndpoints: IApiEndpoints;
}
export interface ISpot {
  id: number;
  name: string;
}
export interface IBasis {
  id: string;
  user: IUser;
  spot: ISpot;
}
export interface IEndpoints extends IBasis {
  measurementsUrl?: string;
  globalIrradianceUrl?: string;
  dischargesUrl?: string;
  discharges: IMeasurement[];
  measurements: IMeasurementConc[];
  globalIrradiances: IMeasurement[];
}
export interface IGeneric extends IBasis {
  pgId: number;
  type: GenericTypeDE;
  name: string;
  url?: string;
  comment?: string;
  data: IMeasurement[];
}
export interface IReport {
  id: string;
  email: string;
  type: ReportType;
  message: string;
  stack?: string;
  source: IObject;
}

export interface IBuildReport {
  id: string;
  message: string;
  source: IGeneric | IEndpoints | Spot;
  type: ReportType;
  stack?: string;
  email: string;
}

// end DB
export interface IObject {
  [key: string]: any;
}
export interface IMeasurement {
  date: string;
  value: number;
  comment?: string;
}
export interface IMeasurementConc {
  date: string;
  conc_ec: number;
  conc_ie: number;
  comment?: string;
}
export interface IApiResponse {
  data: any[];
  success: boolean;
  apiVersion: string;
}
export interface IApiEndpoints {
  measurementsUrl?: string;
  globalIrradianceUrl?: string;
  dischargesUrl?: string;
}
