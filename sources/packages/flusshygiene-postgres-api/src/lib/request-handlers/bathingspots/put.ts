import { getCustomRepository } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { Region } from '../../../orm/entity/Region';
import { SUCCESS } from '../../messages';
import { RegionRepository } from '../../repositories/RegionRepository';
import { HttpCodes, putResponse } from '../../common';
import {createSpotWithValues} from '../../utils/bathingspot-helpers';
import { getEntityFields } from '../../utils/get-entity-fields';
import { getMatchingValues } from '../../utils/get-matching-values-from-request';
import { BathingspotRepository } from '../../repositories/BathingspotRepository';
import { getSpotByUserAndId } from '../../utils/custom-repo-helpers';
import {
  errorResponse, responder,
  responderMissingBodyValue,
  responderWrongId,
  successResponse,
} from '../responders';

export const updateBathingspotOfUser: putResponse = async (request, response) => {
  const spotRepo = getCustomRepository(BathingspotRepository);
  const regionRepo = getCustomRepository(RegionRepository);
  try {
    const filteredPropNames = await getEntityFields('Bathingspot');
    const spotFromUser = await getSpotByUserAndId(request.params.userId, request.params.spotId);
    if (spotFromUser instanceof Bathingspot) {
      const providedValues = getMatchingValues(request.body, filteredPropNames.props);
      if (Object.keys(providedValues).length > 0) {
        if (providedValues.hasOwnProperty('region') === true) {
          const region = await regionRepo.findByName(providedValues.region);
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
