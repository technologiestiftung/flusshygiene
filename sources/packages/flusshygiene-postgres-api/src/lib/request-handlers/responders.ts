import { Response } from 'express';
import { User } from '../../orm/entity/User';
import { ERRORS, SUGGESTIONS } from '../messages';
import {
  ErrorResponder,
  HttpCodes,
  PayloadBuilder,
  Responder,
  SuccessResponder,
  SuggestionResponder,
} from '../types-interfaces';

/**
 * build a payload. This is to reduce repetition
 * @param success
 * @param message
 * @param data
 */
const buildPayload: PayloadBuilder = (success, message, data) => {
  return {
    data,
    message,
    success,
  };
};

export const userIDErrorResponse = () => buildPayload(false, ERRORS.badRequestMissingOrWrongID404, undefined);
/**
 * Builds an error response to send out
 *
 * @param error The error to report to the user
 */
export const errorResponse: ErrorResponder = (error) => {
  if (process.env.NODE_ENV === 'development') {
    throw error;
  }
  const msg = process.env.NODE_ENV === 'development' ? error.message : 'internal server error';
  return buildPayload(false, msg, undefined);
};

/**
 * Builds an response that holds a suggestion how to query the API
 * @param message the message to send to the response
 * @param data the example suggestion data
 */
export const suggestionResponse: SuggestionResponder = (message, data) => buildPayload(false, message, data);

/**
 * Builds a success message normaly 200 or 201
 * @param message
 * @param data
 */
export const successResponse: SuccessResponder = (message, data) => buildPayload(true, message, data);
/**
 * The default responder for json
 * @param response
 * @param statusCode
 * @param payload
 */
export const responder: Responder = (response, statusCode, payload) => {
  response.status(statusCode).json(payload);
};

/**
 * Response for missing values 404
 * @param response
 * @param example
 */
export const responderMissingBodyValue = (response: Response, example: object) => {
  return responder(response, HttpCodes.badRequestNotFound, suggestionResponse(SUGGESTIONS.missingFields, example));
};

/**
 * respoinder for success messages 200
 * @param response
 * @param message
 */
export const responderSuccess = (response: Response, message: string) => {
  return responder(response, HttpCodes.success, successResponse(message));
};

/**
 * Responder for created success 201
 * @param response
 * @param message
 * @param data
 */
export const responderSuccessCreated = (response: Response, message: string, data?: User) => {
  return responder(response, HttpCodes.successCreated, successResponse(message, data));
};

/**
 * responder for missing ids. This actually should never happen 400
 * @param response
 */
export const responderMissingId = (response: Response) => {
  return responder(response, HttpCodes.badRequest, userIDErrorResponse());
};

/**
 * responses for wrong ids 404
 * @param response
 */
export const responderWrongId = (response: Response) => {
  return responder(response, HttpCodes.badRequestNotFound, userIDErrorResponse());
};
