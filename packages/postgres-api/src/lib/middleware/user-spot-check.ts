import { getSpot } from './../utils/spot-repo-helpers';
import { NextFunction, Request, Response } from 'express';
import {
  responderWrongId,
  responder,
  errorResponse,
} from '../request-handlers/responders';
import { HttpCodes } from '../common';
import { getUserById } from '../utils/user-repo-helpers';
export const checkUserAndSpot = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const spotId = parseInt(request.params.spotId, 10);
    const userId = parseInt(request.params.userId, 10);
    const spot = await getSpot(userId, spotId);
    if (spot !== undefined) {
      response.locals.spot = spot;
      next();
    } else {
      responderWrongId(response);
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};

export const checkUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // const userId = parseInt(request.params.userId, 10);
  try {
    const user = await getUserById(request.params.userId);
    if (user !== undefined) {
      response.locals.user = user;
      next();
    } else {
      responderWrongId(response);
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
