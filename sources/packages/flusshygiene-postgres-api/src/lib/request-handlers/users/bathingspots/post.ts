import {  getManager } from 'typeorm';
import { User } from '../../../../orm/entity/User';
import { getUserWithRelations } from '../../../repositories/custom-repo-helpers';
import { HttpCodes, postResponse, UserRole } from '../../../types-interfaces';
import { getEntityFields, getMatchingValues } from '../../../utils';
import {
  errorResponse,
  responder,
  responderMissingBodyValue,
  responderNotAuthorized,
  responderWrongId,
  successResponse,
} from '../../responders';
import { getRegionsList } from './../../../repositories/custom-repo-helpers';
import { createSpotWithValues } from './../../../utils/bathingspot-helpers';

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
    const list = await getRegionsList();
    const filteredPropNames = await getEntityFields('Bathingspot');
    const user = await getUserWithRelations(request.params.userId, ['bathingspots']);

    if (user instanceof User && user.role !== UserRole.reporter) {
        const providedValues = getMatchingValues(request.body, filteredPropNames.props);
        const spot = await createSpotWithValues(providedValues);

        if ((spot.isPublic === true &&
        (providedValues.hasOwnProperty('region') === false ||
          list.includes(request.body.region) === false) || request.body.hasOwnProperty('isPublic') === false)
      ) {
        responderMissingBodyValue(response, {
          'possible-regions': list,
          'problem': 'when isPublic is set to true you need to set a region',
        });
      } else {
        user.bathingspots.push(spot);
        try {
          await getManager().save(user);
        } catch (err) {
          console.log('this is the error');
          console.log(err);
        }
        responder(response,
          HttpCodes.successCreated,
          successResponse('Bathingspot created', []));
      }
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
