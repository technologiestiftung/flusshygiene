import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { Bathingspot } from '../../orm/entity/Bathingspot';
import { Region } from '../../orm/entity/Region';
import { User } from '../../orm/entity/User';
import { version } from './../version';

export const apiVersion = version;
export interface IFilteredEntityPropsResoponse {
  props: string[];
}
/**
 * a defatul response payload
 */
export interface IDefaultResponsePayload {
  success: boolean;
  message?: string;
  data?: User | User[] | Bathingspot[] | object | undefined;
  apiVersion?: string;
}
/**
 * Super generic object interface
 */
export interface IObject {
  [prop: string]: any;
}

/**
 * listz entry interface for Regions getRegionsList
 * e.g. { name: 'berlin'}
 */
export interface IRegionListEntry {
  name: string;
}
/**
 *
 */
export type entityFields = (
  type: string,
) => Promise<IFilteredEntityPropsResoponse>;

export type postResponse = (request: Request, response: Response) => void;
export type getResponse = (request: Request, response: Response) => void;
// export type getCollectionResponse = (request: Request, response: Response) => void;
export type putResponse = (request: Request, response: Response) => void;
export type deleteResponse = (request: Request, response: Response) => void;

// responder.ts
export type Responder = (
  response: Response,
  statusCode: number,
  payload: IDefaultResponsePayload | User[] | Bathingspot[] | Region[],
) => void;

export type SuccessResponder = (
  message?: string,
  data?: any[],
  truncated?: boolean,
  skip?: number,
  limit?: number,
) => IDefaultResponsePayload;

export type SuggestionResponder = (
  message?: string,
  data?: object,
) => IDefaultResponsePayload;

export type ResponderSuccessCreated = (
  response: Response,
  message: string,
  data?: [User],
) => void;

export type ResponderSuccess = (response: Response, message: string) => void;

export type ErrorResponder = (
  error: Error | ValidationError | ValidationError[],
) => IDefaultResponsePayload;

export type PayloadBuilder = (
  success: boolean,
  message?: string,
  data?: any,
  truncated?: boolean,
  skip?: number,
  limit?: number,
) => IDefaultResponsePayload;

export type ResponderMissingBodyValue = (
  response: Response,
  example: object,
) => void;

export type ResponderWrongIdOrSuccess = (
  element: Region | Bathingspot | User | undefined,
  response: Response,
) => void;

// User put.ts

export type RegionExsists = (
  regions: string[],
  region: string | undefined,
) => boolean;

// custom-repo-helpers.ts
// export type ResponderMissingOrWrongId = (response: Response) => void;
export type ResponderMissingOrWrongIdOrAuth = (response: Response) => void;
export type GetByIds = (
  userId: number,
  spotId: number,
) => Promise<Bathingspot | undefined>;
export type GetById = (spotId: number) => Promise<Bathingspot | undefined>;
export type GetByIdWithRelations = (
  id: number,
  relations: string[],
) => Promise<User | Bathingspot | undefined>;

// utils/get-properties-values.ts

/**
 * Get values in a generic vay usage
 *
 * `const hasForce = getPropsValueGeneric<boolean>(request.body, 'force');`
 *
 * @param obj theobjrct to inspect
 * @param key the key to lookfor
 */
export type GetPropsValueGeneric = <T>(obj: any, key: string) => T;

// utils/bathingspot-helpers.ts

// ███████╗███╗   ██╗██╗   ██╗███╗   ███╗███████╗
// ██╔════╝████╗  ██║██║   ██║████╗ ████║██╔════╝
// █████╗  ██╔██╗ ██║██║   ██║██╔████╔██║███████╗
// ██╔══╝  ██║╚██╗██║██║   ██║██║╚██╔╝██║╚════██║
// ███████╗██║ ╚████║╚██████╔╝██║ ╚═╝ ██║███████║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝

export enum UserRole {
  admin = 'admin',
  creator = 'creator',
  reporter = 'reporter',
}

export enum Pagination {
  'limit' = 50,
  'skip' = 0,
}
export enum HttpCodes {
  'success' = 200,
  'successCreated' = 201,
  'suceessNoContent' = 204,
  'badRequest' = 400,
  'badRequestUnAuthorized' = 401,
  'badRequestForbidden' = 403,
  'badRequestNotFound' = 404,
  'badRequestNotAllowed' = 405,
  'badRequestConflict' = 409,
  'internalError' = 500,
}

export enum DefaultRegions {
  berlinbrandenburg = 'berlinbrandenburg',
  berlin = 'berlin',
  schleswigholstein = 'schleswigholstein',
  niedersachsen = 'niedersachsen',
}

/**
 * Needs translation
 */
export enum PredictionValue {
  gut = 'gut',
  ausgezeichnet = 'ausgezeichnet',
  mangelhaft = 'mangelhaft',
  ausreichend = 'ausreichend',
}

export enum BathingspotCategories {
  lake = 'Lake',
  river = 'River',
  transboundary = 'Transboundary',
  coastal = 'Coastal',
  default = 'undefiend',
}
