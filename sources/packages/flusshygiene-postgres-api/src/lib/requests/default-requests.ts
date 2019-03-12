import { IDefaultResponsePayload, getResponse, postResponse } from '../types-interfaces';

const defaultResponsePayload: IDefaultResponsePayload = {success: true};
export const defaultPostResponse: postResponse = async (_request, response) =>{
  response.status(201).json(defaultResponsePayload);
}

export const defaultGetResponse: getResponse = async (_request, response) =>{
  response.status(200).json(defaultResponsePayload);
}

