import { Bathingspot } from './../../orm/entity/Bathingspot';
import { IDefaultResponsePayload, HttpCodes } from '../types-interfaces';
import { Response } from 'express';
import { User } from '../../orm/entity/User';

type Responder = (response: Response, statusCode:number, payload: IDefaultResponsePayload | User[] | Bathingspot[]) => void;

export const userIDErrorResponse = (id?: string|number|undefined) =>{
  if(id === undefined){
    id = 'NULL';
  }
  const res: IDefaultResponsePayload = {
    success: false,
    message: `request received but user with id: "${id}" does not exist`,
  }
  return res;
}
export const errorResponse: (error: Error) => IDefaultResponsePayload = (error) => {
  const res: IDefaultResponsePayload = {
    success: false,
    message: process.env.NODE_ENV === 'development' ? error.message : 'internal server error'
  };
  return res;
}

export const successResponse: (message?: string, data?:User) => IDefaultResponsePayload = (message, data)=> {
  const res: IDefaultResponsePayload = {
    success: true,
    message: message,
    data: data
  }
  return res;
}

export const responder: Responder = (response, statusCode, payload) =>{
  response.status(statusCode).json(payload);
}
export const responderMissingBodyValue = (response: Response, message: string ) =>{
  return responder(response, HttpCodes.badRequest, errorResponse(new Error(message)));
}

export const responderSuccess = (response: Response, message: string)=>{
  return responder(response, HttpCodes.success, successResponse(message));
}
export const responderSuccessCreated = (response: Response, message: string, data?: User)=>{
  return responder(response, HttpCodes.successCreated, successResponse(message, data));
}
export const responderMissingId = (response: Response)=>{
  return responder(response, HttpCodes.badRequest, userIDErrorResponse());
}
export const responderWrongId = (response: Response, id: string|number)=>{
  return responder(response, HttpCodes.badRequestNotFound, userIDErrorResponse(id));
}
