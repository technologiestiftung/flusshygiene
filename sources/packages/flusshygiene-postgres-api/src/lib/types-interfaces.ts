import { Request, Response} from 'express';
import { User } from '../orm/entity/User';
import { Bathingspot } from './../orm/entity/Bathingspot';

export interface IFilteredEntityPropsResoponse {
  props: string[];
}
/**
 * a defatul response payload
 */
export interface IDefaultResponsePayload {
  success: boolean;
  message?: string;
  data?: User|User[]|Bathingspot[]|object|undefined;
}
/**
 * Super generic object interface
 */
export interface IObject {
  [prop: string]: any;
}

/**
 *
 */
export type entityFields = (type: string) => Promise<IFilteredEntityPropsResoponse>;

export type postResponse = (request: Request, response: Response) => void;
export type getResponse = (request: Request, response: Response) => void;
export type putResponse = (request: Request, response: Response) => void;
export type deleteResponse = (request: Request, response: Response) => void;

export type Responder = (
  response: Response,
  statusCode: number,
  payload: IDefaultResponsePayload | User[] | Bathingspot[]) => void;

export type SuccessResponder = (message?: string, data?: User | User[] | Bathingspot[]) => IDefaultResponsePayload;

export type ErrorResponder = (error: Error) => IDefaultResponsePayload;
export type SuggestionResponder = (message?: string, data?: object) => IDefaultResponsePayload;

export type PayloadBuilder = (success: boolean, message?: string, data?: any) => IDefaultResponsePayload;

export enum UserRole {
  admin = 'admin',
  creator = 'creator',
  reporter = 'reporter',
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

export enum Regions {
  berlinbrandenburg = 'berlinbrandenburg',
}

