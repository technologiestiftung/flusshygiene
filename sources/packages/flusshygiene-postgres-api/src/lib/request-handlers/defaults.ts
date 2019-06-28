import { Request } from 'express';
import { Response } from 'express-serve-static-core';
import { getResponse, IDefaultResponsePayload, postResponse } from '../common';

const defaultResponsePayload: IDefaultResponsePayload = {success: true};

export const defaultPostResponse: postResponse = async (_request, response) => {
  response.status(201).json(defaultResponsePayload);
};

export const defaultGetResponse: getResponse = async (_request, response) => {
  response.status(200).json(defaultResponsePayload);
};

export const wrongRoute = async (_request: Request, response: Response) => {
  response.status(404).json({success: false});
};
