import { Bathingspot } from '../../orm/entity/Bathingspot';
import { IDefaultResponsePayload, HttpCodes } from '../types-interfaces';
import { Response } from 'express';
import { User } from '../../orm/entity/User';
import { ERRORS, SUGGESTIONS } from '../messages';

type Responder = (response: Response, statusCode:number, payload: IDefaultResponsePayload | User[] | Bathingspot[]) => void;

export const userIDErrorResponse = () =>{

  const res: IDefaultResponsePayload = {
    success: false,
    message: ERRORS.badRequestMissingOrWrongID404,
  }
  return res;
}
export const errorResponse: (error: Error) => IDefaultResponsePayload = (error) => {
  if(process.env.NODE_ENV === 'development'){
    throw error;
  }
  const res: IDefaultResponsePayload = {
    success: false,
    message: process.env.NODE_ENV === 'development' ? error.message : 'internal server error'
  };
  return res;
}
export const suggestionResponse: (message?: string, data?:object) => IDefaultResponsePayload = (message, data)=> {
  const res: IDefaultResponsePayload = {
    success: false,
    message: message,
    data: data
  }
  return res;
}

export const successResponse: (message?: string, data?:User|User[]|Bathingspot[]) => IDefaultResponsePayload = (message, data)=> {
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
export const responderMissingBodyValue = (response: Response, example:object ) =>{
  return responder(response, HttpCodes.badRequestNotFound, suggestionResponse(SUGGESTIONS.missingFields, example));
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
export const responderWrongId = (response: Response)=>{
    return responder(response, HttpCodes.badRequestNotFound, userIDErrorResponse());
}
