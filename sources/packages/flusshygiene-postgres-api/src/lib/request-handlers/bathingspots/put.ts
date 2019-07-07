import { getRepository } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { Region } from '../../../orm/entity/Region';
import { SUCCESS } from '../../messages';
import { HttpCodes, putResponse } from '../../common';
import {createSpotWithValues} from '../../utils/spot-helpers';
import { getEntityFields } from '../../utils/get-entity-fields';
import { getMatchingValues } from '../../utils/get-matching-values-from-request';

import {
  errorResponse, responder,
  responderMissingBodyValue,
  responderWrongId,
  successResponse,
} from '../responders';
import { getSpot } from '../../utils/spot-repo-helpers';
import { findByName } from '../../utils/region-repo-helpers';

export const updateBathingspotOfUser: putResponse = async (request, response) => {
  const spotRepo = getRepository(Bathingspot);
  // const regionRepo = getRepository(Region);
  try {
    const filteredPropNames = await getEntityFields('Bathingspot');
    const spotFromUser = await getSpot(request.params.userId, request.params.spotId);
    if (spotFromUser instanceof Bathingspot) {
      const providedValues = getMatchingValues(request.body, filteredPropNames.props);
      if (Object.keys(providedValues).length > 0) {
        if (providedValues.hasOwnProperty('region') === true) {
          const region = await findByName(providedValues.region);
          if (region instanceof Region) {
            spotFromUser.region = region;
          } else {
            throw new Error('region is undefined');
          }
        }
        const tmpSpot = await createSpotWithValues(providedValues);
        spotRepo.merge(spotFromUser, tmpSpot);
        const res = await spotRepo.save(spotFromUser);
        responder(response, HttpCodes.successCreated, successResponse(SUCCESS.success201, [res]));
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
