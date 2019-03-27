import { getCustomRepository } from 'typeorm';
import { isObject } from 'util';
import { Bathingspot } from '../../../../orm/entity/Bathingspot';
import { Region } from '../../../../orm/entity/Region';
import { SUCCESS } from '../../../messages';
import { RegionRepository } from '../../../repositories/RegionRepository';
import { HttpCodes, IObject, putResponse } from '../../../types-interfaces';
import { getEntityFields } from '../../../utils/get-entity-fields';
import { getMatchingValues } from '../../../utils/get-matching-values-from-request';
import { BathingspotRepository } from './../../../repositories/BathingspotRepository';
import { getSpotByUserAndId } from './../../../repositories/custom-repo-helpers';
import {
  errorResponse, responder,
  responderMissingBodyValue,
  responderWrongId,
  successResponse,
} from './../../responders';

const updateFields = (spot: Bathingspot, providedValues: IObject) => {
  // const table = [[]];
  // curently silently fails needs some smarter way to set values on entities
  if (isObject(providedValues.apiEndpoints)) {
    spot.apiEndpoints = providedValues.apiEndpoints; // 'json' ]
  }// 'json' ]
  if (isObject(providedValues.state)) {
    spot.state = providedValues.state; // 'json' ]

  }// 'json' ]
  if (isObject(providedValues.location)) {
    spot.location = providedValues.location; // 'json' ]

  }// 'json' ]
  if (typeof providedValues.latitude === 'number') {
    spot.latitude = providedValues.latitude; // 'float8' ]

  }// 'float8' ]
  if (typeof providedValues.longitude === 'number') {
    spot.longitude = providedValues.longitude; // 'float8' ]

  }// 'float8' ]
  if (typeof providedValues.elevation === 'number') {
    spot.elevation = providedValues.elevation; // 'float8' ]
  }// 'float8' ]
  if (typeof providedValues.isPublic === 'boolean') {
    spot.isPublic = providedValues.isPublic;
  }
  if (typeof providedValues.name === 'string') {
    spot.name = providedValues.name;
  }
  return spot;
};

export const updateBathingspotOfUser: putResponse = async (request, response) => {
  const spotRepo = getCustomRepository(BathingspotRepository);
  const regionRepo = getCustomRepository(RegionRepository);
  try {
    const filteredPropNames = await getEntityFields('Bathingspot');
    let spotFromUser = await getSpotByUserAndId(request.params.userId, request.params.spotId);
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
        spotFromUser = updateFields(spotFromUser, providedValues);
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
