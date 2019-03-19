import { Bathingspot } from './../../../../orm/entity/Bathingspot';
import { getResponse, HttpCodes } from '../../../types-interfaces';
import { responderWrongId, responder, successResponse, errorResponse } from '../../responders';
import { getUserWithRelations } from '../../../repositories/custom-repo-helpers';
/**
 * Gets all the bathingspots of the user
 * @param request
 * @param response
 */


export const getUserBathingspots: getResponse = async (request, response) => {
  try {
    const user = await getUserWithRelations(request.params.userId, ['bathingspots']);
    // const userRepo = getCustomRepository(UserRepository);
    // const user: User | undefined = await userRepo.findByIdWithRelations(request.params.userId, ['bathingspots']);// await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
    if (user === undefined) {
      responderWrongId(response);
    } else {
      responder(response, HttpCodes.success, successResponse('all bathingspots', user.bathingspots));
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
}



/**
 * Gets single bathingspot of user by id
 * @param request
 * @param response
 */
export const getOneUserBathingspotById: getResponse = async (request, response) => {
  try {
    const user = await getUserWithRelations(request.params.userId, ['bathingspots']);
    if (user === undefined) {
      responderWrongId(response);
    } else {
      const spots: Bathingspot[] = user.bathingspots.filter(spot => spot.id === parseInt(request.params.spotId, 10));
      if (spots.length > 0) {
        responder(response, HttpCodes.success, [spots[0]]);
      } else {
        responderWrongId(response);
      }
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
}

