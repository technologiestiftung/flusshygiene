import { getResponse, HttpCodes } from '../../types-interfaces';
import { User } from '../../../orm/entity/User';
import { getRepository } from 'typeorm';
import { responder, errorResponse, responderMissingId, responderWrongId, successResponse } from '../responders';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { SUCCESS } from '../../messages';


//  ██████╗ ███████╗████████╗
// ██╔════╝ ██╔════╝╚══██╔══╝
// ██║  ███╗█████╗     ██║
// ██║   ██║██╔══╝     ██║
// ╚██████╔╝███████╗   ██║
//  ╚═════╝ ╚══════╝   ╚═╝



export const getUsers: getResponse = async (_request, response) => {
  let users: User[];

  try {
    users = await getRepository(User).find();
    responder(
      response,
      HttpCodes.success,
      successResponse(SUCCESS.success200, users));

    // response.status(HttpCodes.success).json(users);
  } catch (e) {
    responder(response,
      HttpCodes.internalError,
      errorResponse(e));


  }
}

export const getUser: getResponse = async (request, response) => {
  let user: User | undefined;
  try {
    if (request.params.userId === undefined) {
      responderMissingId(response);
      // throw new Error('mssing id paramter');
    }
    user = await getRepository(User).findOne(request.params.userId);
    if (user === undefined) {
      responderWrongId(response);

    } else {
      responder(
        response,
        HttpCodes.success,
        successResponse(SUCCESS.success200, [user]));
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
    const user: User | undefined = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
    if (user === undefined) {
      // throw new Error('user undefined or 0');
      responderWrongId(response, request.params.userId);
    } else {
      const spots: Bathingspot[] = user.bathingspots.filter(spot => spot.id === parseInt(request.params.spotId, 10));
      if (spots.length > 0) {
        responder(response, HttpCodes.success, [spots[0]]);
      } else {
        responderWrongId(response, 'Wrong bathingspot id');
      }
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
}


/**
 * Gets all the bathingspots of the user
 * @param request
 * @param response
 */
export const getUserBathingspots: getResponse = async (request, response) => {
  try {
    const user: User | undefined = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
    if (user === undefined) {
      // throw new Error('user undefined or 0');
      responderWrongId(response, request.params.userId);
    } else {
      responder(response, HttpCodes.success, successResponse('all bathingspots', user.bathingspots));
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
}
