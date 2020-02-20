import { IDefaultResponsePayload } from './../common/index';
import { ValidationError } from 'class-validator';
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
} from '../common';
import { apiVersion, ResponderWrongIdOrSuccess } from '../common';
import { ERRORS, SUCCESS, SUGGESTIONS } from '../messages';

/**
 * build a payload. This is to reduce repetition
 * @param success
 * @param message
 * @param data
 */
export const buildPayload: PayloadBuilder = (
  success,
  message,
  data,
  truncated = false,
  skip = undefined,
  limit = undefined,
) => {
  return {
    apiVersion,
    data,
    limit,
    message,
    skip,
    success,
    truncated,
  };
};
/**
 * a error Response with a wrong user ID 404
 */
export const userIDErrorResponse = () =>
  buildPayload(false, ERRORS.badRequestMissingOrWrongID404, undefined);

/**
 * a error Response with a duplicate values 409
 */
export const duplicateValuesErrorResponse = () =>
  buildPayload(false, ERRORS.badRequestDuplicateValuesID409, undefined);

/**
 * a error Response with a wrong user ID 404
 */
export const userNotAuthorizedErrorResponse = () =>
  buildPayload(false, ERRORS.badRequestUserNotAuthorized, undefined);
/**
 * Builds an error response to send out
 *
 * @param error The error to report to the user
 */
export const errorResponse: ErrorResponder = (error) => {
  if (process.env.NODE_ENV === 'development') {
    // console.error(error);
    throw error;
  } else {
    const name = error.constructor.name;
    return buildPayload(
      false,
      `${name !== undefined ? name : 'Error'}: "${
        !(error instanceof ValidationError) ? error.message : 'ValidationError'
      }"`,
      undefined,
    );
  }
};

/**
 * Builds an response that holds a suggestion how to query the API
 * @param message the message to send to the response
 * @param data the example suggestion data
 */
export const suggestionResponse: SuggestionResponder = (message, data) =>
  buildPayload(false, message, data);

/**
 * Builds a success message normaly 200 or 201
 * @param message
 * @param data
 */
export const successResponse: SuccessResponder = (
  message,
  data,
  truncated = false,
  skip = undefined,
  limit = undefined,
  success = true,
) => buildPayload(success, message, data, truncated, skip, limit);

export const partialSuccessResponder: (opts: {
  message: string;
  data: any | any[];
  truncated?: boolean;
  skip?: number;
  limit?: number;
  success?: boolean;
}) => IDefaultResponsePayload = ({
  message,
  data,
  truncated = false /* default true*/,
  skip = undefined /* undef*/,
  limit = undefined /*undef */,
  success = true /* true */,
}) => {
  return buildPayload(success, message, data, truncated, skip, limit);
};

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
) =>
  responder(
    response,
    HttpCodes.badRequestNotFound,
    suggestionResponse(SUGGESTIONS.missingFields, example),
  );

/**
 * respoinder for success messages 200
 * @param response
 * @param message
 */
export const responderSuccess: ResponderSuccess = (response, message) =>
  responder(response, HttpCodes.success, successResponse(message));

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
) =>
  responder(response, HttpCodes.successCreated, successResponse(message, data));

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
export const responderWrongId: ResponderMissingOrWrongIdOrAuth = (response) =>
  responder(response, HttpCodes.badRequestNotFound, userIDErrorResponse());

export const responderDuplicateValues: ResponderMissingOrWrongIdOrAuth = (
  response,
) =>
  responder(
    response,
    HttpCodes.badRequestConflict,
    duplicateValuesErrorResponse(),
  );
export const responderWrongRoute: ResponderMissingOrWrongIdOrAuth = (
  response,
) => responder(response, HttpCodes.badRequestNotFound, userIDErrorResponse());

export const responderNotAuthorized: ResponderMissingOrWrongIdOrAuth = (
  response,
) =>
  responder(
    response,
    HttpCodes.badRequestUnAuthorized,
    userNotAuthorizedErrorResponse(),
  );

export const responderWrongIdOrSuccess: ResponderWrongIdOrSuccess = (
  element,
  response,
) => {
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
