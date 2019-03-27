import { getCustomRepository, getRepository } from 'typeorm';
import { Region } from '../../../orm/entity/Region';
import { SUCCESS } from '../../messages';
import { RegionRepository } from '../../repositories/RegionRepository';
import { deleteResponse, getResponse, postResponse, putResponse } from '../../types-interfaces';
import { getEntityFields } from '../../utils';
import { errorResponse, responder, responderMissingBodyValue, responderWrongId, successResponse } from '../responders';
import { HttpCodes } from './../../types-interfaces';

export const getAllRegions: getResponse = async (_request, response) => {
  try {

    const regions = await getRepository(Region).find();
    responder(response, HttpCodes.success, successResponse(SUCCESS.success200, regions));
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));

  }
};

export const getRegionById: getResponse = async (request, response) => {
  try {
    const regionRepo = getCustomRepository(RegionRepository);
    const region = await regionRepo.findOne(request.params.regionId);
    if (region === undefined) {
      responderWrongId(response);
    } else {
      responder(response, HttpCodes.success, successResponse(SUCCESS.success200, [region]));
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));

  }
};
export const postRegion: postResponse = async (request, response) => {
  try {
    const example = await getEntityFields('Region');
    const regionRepo = getRepository(Region);
    if (request.body.hasOwnProperty('name') !== true) {
      responderMissingBodyValue(response, example);
    } else if (request.body.hasOwnProperty('displayName') !== true) {
      responderMissingBodyValue(response, example);
    } else {
      const region = new Region();
      region.name = request.body.name;
      region.displayName = request.body.displayName;
      const res = await regionRepo.save(region);
      responder(response, HttpCodes.successCreated, successResponse(SUCCESS.success201, [res]));
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};

export const putRegion: putResponse = async (request, response) => {
  try {
    const regionRepo = getRepository(Region);
    const regionId = request.params.regionId;
    const region = await regionRepo.findOne(regionId);
    if (region === undefined) {
      responderWrongId(response);
    } else {
      regionRepo.merge(region, request.body);
      await regionRepo.save(region);
      responder(response, HttpCodes.successCreated, successResponse(SUCCESS.success201, [region]));
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};

export const deleteRegion: deleteResponse = async (request, response) => {
  try {
    const regionRepo = getCustomRepository(RegionRepository);
    const regionId = request.params.regionId;
    const region = await regionRepo.findByIdWithRelations(regionId, ['bathingspots']);
    if (region === undefined) {
      responderWrongId(response);
    } else {
      const res = await regionRepo.remove(region);
      responder(response, HttpCodes.success, successResponse(SUCCESS.successDelete200, [res]));
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
