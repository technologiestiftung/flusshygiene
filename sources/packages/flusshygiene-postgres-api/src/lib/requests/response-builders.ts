import { IDefaultResponsePayload } from '../types-interfaces';

export const userIDErrorResponse = (id: string|number) =>{
  const res: IDefaultResponsePayload = {
    success: true,
    message: `requst received but user with id: "${id}" does not exist`,
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

export const successResponse: (message?: string) => IDefaultResponsePayload = (message)=> {
  const res: IDefaultResponsePayload = {
    success: true,
    message: message
  }
  return res;
}
