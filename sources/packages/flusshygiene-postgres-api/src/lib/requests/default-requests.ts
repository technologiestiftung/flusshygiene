import { IDefaultResponsePayload, getResponse, postResponse, HttpCodes } from '../types-interfaces';
import { Request } from 'express';
import { Response } from 'express-serve-static-core';

const defaultResponsePayload: IDefaultResponsePayload = {success: true};
export const defaultPostResponse: postResponse = async (_request, response) =>{
  response.status(201).json(defaultResponsePayload);
}

export const defaultGetResponse: getResponse = async (_request, response) =>{
  response.status(200).json(defaultResponsePayload);
}

export const wrongRoute = async (error: Error, _request: Request, response: Response) =>{
  response.status(HttpCodes.badRequestNotFound).json(error);
}
