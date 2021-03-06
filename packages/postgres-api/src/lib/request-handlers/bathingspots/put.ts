import { getRepository } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { Region } from '../../../orm/entity/Region';
import { HttpCodes, putResponse } from '../../common';
import { SUCCESS } from '../../messages';
import { getEntityFields } from '../../utils/get-entity-fields';
import { getMatchingValues } from '../../utils/get-matching-values-from-request';
// import { createSpotWithValues } from '../../utils/spot-helpers';

import { findByName } from '../../utils/region-repo-helpers';
import { getUsersSpot } from '../../utils/spot-repo-helpers';
import {
  errorResponse,
  responder,
  responderMissingBodyValue,
  responderWrongId,
  successResponse,
} from '../responders';

export const updateBathingspotOfUser: putResponse = async (
  request,
  response,
) => {
  const spotRepo = getRepository(Bathingspot);
  // const regionRepo = getRepository(Region);
  try {
    const filteredPropNames = await getEntityFields('Bathingspot');
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const spotFromUser = await getUsersSpot(userId, spotId);
    if (spotFromUser instanceof Bathingspot) {
      const providedValues = getMatchingValues(
        request.body,
        filteredPropNames.props,
      );
      // console.log('PUT: body', request.body);
      // console.log('PUT: filtered values', providedValues);
      if (Object.keys(providedValues).length > 0) {
        if (providedValues.hasOwnProperty('region') === true) {
          const region = await findByName(providedValues.region);
          if (region instanceof Region) {
            spotFromUser.region = region;
          } /* else {
            throw new Error('region is undefined');
          }*/
        }
        // const tmpSpot = await createSpotWithValues(providedValues);
        spotRepo.merge(spotFromUser, request.body);
        // console.log(spotFromUser);
        const res = await spotRepo.save(spotFromUser);
        responder(
          response,
          HttpCodes.successCreated,
          successResponse(SUCCESS.success201, [res]),
        );
      } else {
        responderMissingBodyValue(response, filteredPropNames);
      }
    } else {
      responderWrongId(response);
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};
