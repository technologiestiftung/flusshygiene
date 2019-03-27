import { getCustomRepository } from 'typeorm';
import { SUCCESS } from '../../../messages';
import { getRegionsList, getSpotByUserAndId, getUserWithRelations } from '../../../repositories/custom-repo-helpers';
import { RegionRepository } from '../../../repositories/RegionRepository';
import { getResponse, HttpCodes } from '../../../types-interfaces';
import { errorResponse, responder, responderWrongId, successResponse } from '../../responders';
import { BathingspotRepository } from './../../../repositories/BathingspotRepository';
/**
 * Gets all the bathingspots of the user
 * @param request
 * @param response
 */

export const getUserBathingspots: getResponse = async (request, response) => {
  try {
    const user = await getUserWithRelations(request.params.userId, ['bathingspots']);

    if (user === undefined) {
      responderWrongId(response);
    } else {
      responder(response, HttpCodes.success, successResponse(SUCCESS.success200, user.bathingspots));
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};

/**
 * Gets single bathingspot of user by id
 * @param request
 * @param response
 */
export const getOneUserBathingspotById: getResponse = async (request, response) => {
  try {
    const spotFromUser = await getSpotByUserAndId(request.params.userId, request.params.spotId);
    if (spotFromUser === undefined) {
      responderWrongId(response);
    } else {
      responder(response, HttpCodes.success, successResponse(SUCCESS.success200, [spotFromUser]));
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};

export const getOneUsersBathingspotsByRegion: getResponse = async (request, response) => {
  try {
    // const regionsRepo = getCustomRepository(RegionRepository);
    // let list = await regionsRepo.getNamesList();
    // list = list.map(obj => obj.name);
    const list = await getRegionsList();

    if (!(list.includes(request.params.region))) {
      responderWrongId(response);
    } else {
      const spotRepo = getCustomRepository(BathingspotRepository);
      const regionRepo = getCustomRepository(RegionRepository);
      const region = await regionRepo.findByName(request.params.region);
      const userId = request.params.userId;
      const spots = await spotRepo.findByUserAndRegion(userId, region!.id);
      if (spots !== undefined) {
          responder(response, HttpCodes.success, successResponse(SUCCESS.success200, spots));
        } else {
          responder(response, HttpCodes.success, successResponse(SUCCESS.success200, []));

        }
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};
