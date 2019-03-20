import { getManager, getRepository } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { User } from '../../../orm/entity/User';
import { deleteResponse, HttpCodes } from '../../types-interfaces';
import { errorResponse, responder, responderSuccess, responderWrongId } from '../responders';

// ██████╗ ███████╗██╗     ███████╗████████╗███████╗
// ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
// ██║  ██║█████╗  ██║     █████╗     ██║   █████╗
// ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝
// ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
// ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝

export const deleteUser: deleteResponse = async (request, response) => {
  try {
    const user = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
    if (user === undefined) {
      responderWrongId(response);
    } else {
      if (user.protected === true) {
        responder(response,
          HttpCodes.badRequestForbidden,
          errorResponse(new Error('You cannot delete a protected User')));
      } else {
        if (user.bathingspots.length !== 0) {
          const protectedUser = await getRepository(User).findOne(
            { where: { protected: true }, relations: ['bathingspots'] });
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
          }
        }
        await getRepository(User).remove(user);
        responderSuccess(response, 'deleted user');
      }
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }

};

