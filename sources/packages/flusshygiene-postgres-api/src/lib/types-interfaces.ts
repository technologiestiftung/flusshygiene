import { Request, Response} from 'express';

export interface IDefaultResponsePayload {
  success: boolean;
  message?: string;
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
  'internalError' = 500,
};

