import { Request, Response} from 'express';
import { User } from '../orm/entity/User';

export interface IDefaultResponsePayload {
  success: boolean;
  message?: string;
  data?: User|undefined;
};

export type postResponse = (request: Request, response: Response) => void;
export type getResponse = (request: Request, response: Response) => void;
export type putResponse = (request: Request, response: Response) => void;
export type deleteResponse = (request: Request, response: Response) => void;
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
  'badRequestNotFound' = 404,
  'internalError' = 500,
};

export enum Regions {
  berlinbrandenburg = 'berlinbrandenburg',
};
