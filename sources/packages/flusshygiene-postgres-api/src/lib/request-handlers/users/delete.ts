import { deleteResponse, HttpCodes } from '../../types-interfaces';
import { getRepository, getManager } from 'typeorm';
import { User } from '../../../orm/entity/User';
import { responderWrongId, responder, errorResponse, responderSuccess } from '../responders';
import { Bathingspot } from '../../../orm/entity/Bathingspot';



// ██████╗ ███████╗██╗     ███████╗████████╗███████╗
// ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
// ██║  ██║█████╗  ██║     █████╗     ██║   █████╗
// ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝
// ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
// ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝




export const deleteUser: deleteResponse = async (request, response) => {
  try {
    // console.log('req id value',request.params.userId);
    // if (request.params.hasOwnProperty('id') === false) {
    //   // throw new Error('Missing id paramter');
    //   responderMissingId(response);
    //   // responder(
    //   //   response,
    //   //   HttpCodes.badRequest,
    //   //   errorResponse(new Error('Missing ID paramter'))
    //   // );
    // }
    const user = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
    if (user === undefined) {
      responderWrongId(response, request.params.userId);

      // responder(
      //   response,
      //   HttpCodes.badRequestNotFound,
      //   userIDErrorResponse(request.params.userId)
      // );
    } else {
      if (user.protected === true) {
        responder(response, HttpCodes.badRequestForbidden, errorResponse(new Error('You cannot delete a protected User')));
      } else {
        if (user.bathingspots.length !== 0) {
          const protectedUser = await getRepository(User).findOne({ where: { protected: true }, relations: ['bathingspots'] });
          if (protectedUser === undefined) {
            throw new Error('No protected user found!');
          } else {
            const spots: Bathingspot[] = [];
            user.bathingspots.forEach((spot) => {
              // we must retain all the public bathingspots
              // or not?
              if (spot.isPublic === true) {
                spot.isPublic = false; // keep them for moderation
                spots.push(spot);
              }
            });
            protectedUser.bathingspots = protectedUser.bathingspots.concat(spots);
            const manager = getManager();
            await manager.save(protectedUser);
            // if (process.env.NODE_ENV === 'development') {
            //   process.stdout.write(JSON.stringify(res));
            //   process.stdout.write('\n');
            // }
          }
        }
        await getRepository(User).remove(user);
        responderSuccess(response, 'deleted user');
      }
    }

    // responder(
    //   response,
    //   HttpCodes.success,
    //   successResponse('deleted user')
    // );
    // response.status(HttpCodes.success).json(successResponse('deleted user'));
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
    // response.status(HttpCodes.internalError).json(errorResponse(e));
  }

}

