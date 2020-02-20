import { NextFunction, Request, Response } from 'express';
import { HttpCodes } from '../common';
import { getUsersSpot } from '../utils/spot-repo-helpers';
import {
  errorResponse,
  responder,
  responderWrongId,
} from '../request-handlers/responders';
export const postFileMiddleWare = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const spotId = parseInt(request.params.spotId, 10);
    const userId = parseInt(request.params.userId, 10);
    const collectionName = request.params.collectionName;
    if (collectionName !== 'images' && collectionName !== 'models') {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionName}" can't process uploads`,
        success: false,
      });
    } else {
      const spot = await getUsersSpot(userId, spotId);
      // console.log(spot);
      if (spot !== undefined) {
        // check user
        // check spot
        response.locals.spot = spot;
        next();
      } else {
        responderWrongId(response);
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
