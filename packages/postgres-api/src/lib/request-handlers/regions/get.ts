import { getRepository } from 'typeorm';
import { Region } from '../../../orm/entity/Region';
import { getResponse, HttpCodes } from '../../common';
import { SUCCESS } from '../../messages';
import {
  errorResponse,
  responder,
  responderWrongIdOrSuccess,
  successResponse,
} from '../responders';

export const getAllRegions: getResponse = async (_request, response) => {
  try {
    const regions = await getRepository(Region).find();
    responder(
      response,
      HttpCodes.success,
      successResponse(SUCCESS.success200, regions),
    );
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};

export const getRegionById: getResponse = async (request, response) => {
  try {
    const regionRepo = getRepository(Region);
    const region = await regionRepo.findOne(request.params.regionId);
    responderWrongIdOrSuccess(region, response);
    // if (region === undefined) {
    //   responderWrongId(response);
    // } else {
    //   responder(response, HttpCodes.success, successResponse(SUCCESS.success200, [region]));
    // }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
