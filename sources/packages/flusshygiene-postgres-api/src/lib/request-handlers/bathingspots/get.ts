import { SUCCESS } from '../../messages';
import { getResponse, HttpCodes, Pagination } from '../../common';
import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
} from '../responders';
import { responderWrongIdOrSuccess } from '../responders';
import {
  getAllSpotsFromUser,
  findByUserAndRegion,
  getSpot,
} from '../../utils/spot-repo-helpers';
import { getRegionsList, findByName } from '../../utils/region-repo-helpers';
import { getUserById } from '../../utils/user-repo-helpers';
/**
 * Gets all the bathingspots of the user
 * @param request
 * @param response
 */

export const getUserBathingspots: getResponse = async (request, response) => {
  try {
    const user = await getUserById(request.params.userId);

    if (user === undefined) {
      responderWrongId(response);
    } else {
      let limit: number =
        request.query.limit === undefined
          ? Pagination.limit
          : parseInt(request.query.limit, 10);
      const skip: number =
        request.query.skip === undefined
          ? Pagination.skip
          : parseInt(request.query.skip, 10);
      const spots = await getAllSpotsFromUser(
        request.params.userId,
        skip,
        limit,
      );
      let truncated = true;
      if (spots.length === 0) {
        truncated = false;
      }
      responder(
        response,
        HttpCodes.success,
        successResponse(SUCCESS.success200, spots, truncated, skip, limit),
      );
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
export const getOneUserBathingspotById: getResponse = async (
  request,
  response,
) => {
  try {
    const spotFromUser = await getSpot(
      request.params.userId,
      request.params.spotId,
    );
    responderWrongIdOrSuccess(spotFromUser, response);
    // if (spotFromUser === undefined) {
    //   responderWrongId(response);
    // } else {
    //   responder(response, HttpCodes.success, successResponse(SUCCESS.success200, [spotFromUser]));
    // }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};

export const getOneUsersBathingspotsByRegion: getResponse = async (
  request,
  response,
) => {
  try {
    // const regionsRepo = getCustomRepository(RegionRepository);
    // let list = await regionsRepo.getNamesList();
    // list = list.map(obj => obj.name);
    const list = await getRegionsList();
    let limit: number =
      request.query.limit === undefined
        ? Pagination.limit
        : parseInt(request.query.limit, 10);
    const skip: number =
      request.query.skip === undefined
        ? Pagination.skip
        : parseInt(request.query.skip, 10);
    if (limit > Pagination.limit) {
      limit = Pagination.limit;
    }

    if (!list.includes(request.params.region)) {
      responderWrongId(response);
    } else {
      // const spotRepo =  getRepository(Bathingspot);//getCustomRepository(BathingspotRepository);
      const region = await findByName(request.params.region);
      const userId = request.params.userId;
      const spots = await findByUserAndRegion(userId, region!.id, skip, limit);
      if (spots !== undefined) {
        let truncated = true;
        if (spots.length === 0 || spots.length < limit) {
          truncated = false;
        }
        responder(
          response,
          HttpCodes.success,
          successResponse(SUCCESS.success200, spots, truncated, skip, limit),
        );
      } else {
        responder(
          response,
          HttpCodes.success,
          successResponse(SUCCESS.success200, []),
        );
      }
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};
