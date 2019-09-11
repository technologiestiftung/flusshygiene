import { getManager, getRepository } from 'typeorm';
import { Region } from '../../../orm/entity/Region';
import { User } from '../../../orm/entity/User';
import { HttpCodes, postResponse, UserRole } from '../../common';
import { getAndVerifyRegion } from '../../utils/get-verify-region';
import { getUserByIdWithSpots } from '../../utils/user-repo-helpers';
import {
  errorResponse,
  responder,
  responderNotAuthorized,
  responderWrongId,
  successResponse,
} from '../responders';
import { Bathingspot } from './../../../orm/entity/Bathingspot';

// const verifyPublic: (obj: any) => boolean = (obj) => {
//   let res = false;
//   const hasName = getPropsValueGeneric<string>(obj, 'name');
//   const isPublic = getPropsValueGeneric<boolean>(obj, 'isPublic');
//   if (hasName !== undefined && isPublic === true) {
//     res = true;
//   }
//   return res;
// };

export const addBathingspotToUser: postResponse = async (request, response) => {
  try {
    // const list = await getRegionsList();
    // const filteredPropNames = await getEntityFields('Bathingspot');
    const userId = parseInt(request.params.userId, 10);
    const user = await getUserByIdWithSpots(userId);
    // const spots = await getAllSpotsFromUser(request.params.userId);
    if (user instanceof User && user.role !== UserRole.reporter) {
      // const providedValues = getMatchingValues(
      //   request.body,
      //   filteredPropNames.props,
      // );
      const repo = getRepository(Bathingspot);
      // console.log('POST: body', request.body);
      // console.log('POST: filtered values', providedValues);
      const spot = repo.create([request.body]);

      // const spot = await createSpotWithValues(providedValues);
      if (spot[0] === undefined) {
        throw new Error('Could not create spot!!!');
      }

      // console.log(spot);
      const region = await getAndVerifyRegion(request.body);
      if (region instanceof Region) {
        spot[0].region = region;
      }
      user.bathingspots.push(spot[0]);
      await getManager().save(user);

      responder(
        response,
        HttpCodes.successCreated,
        successResponse('Bathingspot created', [spot[0]]),
      );
      // }
    } else if (user instanceof User && user.role === UserRole.reporter) {
      responderNotAuthorized(response);
    } else {
      responderWrongId(response);
    }
    // } else {
    //   responderMissingBodyValue(response, filteredPropNames);
    // }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};
