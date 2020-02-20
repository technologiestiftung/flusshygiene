import {
  responderWrongRoute,
  responderWrongId,
} from './../request-handlers/responders';
import { getSpot } from './../utils/spot-repo-helpers';
// import { NextFunction, Request, Response } from 'express';
import { AsyncMiddlewareFunction } from '../common';
import { Bathingspot } from '../../orm/entity/Bathingspot';

export const isPublicRoute: AsyncMiddlewareFunction = async (
  _request,
  response,
  next,
) => {
  response.locals.isPublicRoute = true;
  next();
};

export const checkPublicSpot: AsyncMiddlewareFunction = async (
  request,
  response,
  next,
) => {
  const spotId = parseInt(request.params.spotId, 10);
  if (isNaN(spotId) === true) {
    responderWrongRoute(response);
    return;
  }
  const spot = await getSpot(spotId);
  if (spot === undefined || spot.isPublic === false) {
    responderWrongId(response);
    return;
  }
  if (spot instanceof Bathingspot === false) {
    if (spot instanceof Error) {
      throw spot;
    } else {
      throw new Error('Internal server error in public spot check');
    }
  }
  response.locals.spot = spot;
  next();
};
