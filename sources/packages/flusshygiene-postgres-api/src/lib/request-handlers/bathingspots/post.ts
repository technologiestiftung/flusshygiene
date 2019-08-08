import { getManager } from 'typeorm';
import { User } from '../../../orm/entity/User';
import { HttpCodes, postResponse, UserRole } from '../../common';
import { getEntityFields, getMatchingValues } from '../../utils';
import {
  errorResponse,
  responder,
  responderNotAuthorized,
  responderWrongId,
  successResponse,
} from '../responders';

import { createSpotWithValues } from '../../utils/spot-helpers';
import { getUserByIdWithSpots } from '../../utils/user-repo-helpers';

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
    const filteredPropNames = await getEntityFields('Bathingspot');

    const user = await getUserByIdWithSpots(request.params.userId);
    // const spots = await getAllSpotsFromUser(request.params.userId);
    if (user instanceof User && user.role !== UserRole.reporter) {
      const providedValues = getMatchingValues(
        request.body,
        filteredPropNames.props,
      );
      const spot = await createSpotWithValues(providedValues);

      user.bathingspots.push(spot);
      await getManager().save(user);

      responder(
        response,
        HttpCodes.successCreated,
        successResponse('Bathingspot created', [spot]),
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
