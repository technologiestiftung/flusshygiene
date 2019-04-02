
import { ERRORS, SUCCESS, SUGGESTIONS } from '../messages';
import {
  ErrorResponder,
  HttpCodes,
  PayloadBuilder,
  Responder,
  ResponderMissingBodyValue,
  ResponderMissingOrWrongIdOrAuth,
  ResponderSuccess,
  ResponderSuccessCreated,
  SuccessResponder,
  SuggestionResponder,
} from '../types-interfaces';
import { ResponderWrongIdOrSuccess } from './../types-interfaces';

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
/**
 * a error Response with a wrong user ID 404
 */
export const userIDErrorResponse = () => buildPayload(
  false,
  ERRORS.badRequestMissingOrWrongID404,
  undefined);
/**
 * a error Response with a wrong user ID 404
 */
export const userNotAuthorizedErrorResponse = () => buildPayload(
  false,
  ERRORS.badRequestUserNotAuthorized,
  undefined);
/**
 * Builds an error response to send out
 *
 * @param error The error to report to the user
 */
export const errorResponse: ErrorResponder = (error) => {
  if (process.env.NODE_ENV === 'development') {
    throw error;
  } else if (process.env.NODE_ENV === 'test' && process.env.TRAVIS === undefined) {
    console.error(error.name);
    console.error(error.message);
    console.error(error.stack);
    console.trace();
  }
  const msg = process.env.NODE_ENV === 'development' ? error.message : 'internal server error';
  return buildPayload(false, msg, undefined);
};

/**
 * Builds an response that holds a suggestion how to query the API
 * @param message the message to send to the response
 * @param data the example suggestion data
 */
export const suggestionResponse: SuggestionResponder = (
  message,
  data) => buildPayload(false, message, data);

/**
 * Builds a success message normaly 200 or 201
 * @param message
 * @param data
 */
export const successResponse: SuccessResponder = (
  message,
  data,
) => buildPayload(true, message, data);

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
export const responderMissingBodyValue: ResponderMissingBodyValue = (
  response,
  example,
) => responder(response,
  HttpCodes.badRequestNotFound,
  suggestionResponse(
    SUGGESTIONS.missingFields,
    example,
  ));

/**
 * respoinder for success messages 200
 * @param response
 * @param message
 */
export const responderSuccess: ResponderSuccess = (
  response,
  message,
) => responder(
  response,
  HttpCodes.success,
  successResponse(message),
);

/**
 * Responder for created success 201
 * @param response
 * @param message
 * @param data
 */
export const responderSuccessCreated: ResponderSuccessCreated = (
  response,
  message,
  data,
) => responder(
  response,
  HttpCodes.successCreated,
  successResponse(
    message,
    data));

// /**
//  * responder for missing ids. This actually should never happen 400
//  * @param response
//  */
// export const responderMissingId: ResponderMissingOrWrongIdOrAuth = (
//   response,
// ) => responder(
//   response,
//   HttpCodes.badRequest,
//   userIDErrorResponse(),
// );

/**
 * responses for wrong ids 404
 * @param response
 */
export const responderWrongId: ResponderMissingOrWrongIdOrAuth = (
  response,
) => responder(
  response,
  HttpCodes.badRequestNotFound,
  userIDErrorResponse(),
);

export const responderNotAuthorized: ResponderMissingOrWrongIdOrAuth = (response) => responder(
  response,
  HttpCodes.badRequestUnAuthorized,
  userNotAuthorizedErrorResponse(),
  );

export const responderWrongIdOrSuccess: ResponderWrongIdOrSuccess = (element, response) => {
  if (element === undefined) {
    responderWrongId(response);
  } else {
    const res = [element];
    responder(
      response,
      HttpCodes.success,
      successResponse(SUCCESS.success200, res),
      );
  }
};
