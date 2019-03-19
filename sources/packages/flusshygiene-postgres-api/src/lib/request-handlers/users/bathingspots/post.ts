import { Bathingspot } from './../../../../orm/entity/Bathingspot';
import { getManager } from 'typeorm';
import { getUserWithRelations } from '../../../repositories/custom-repo-helpers';
import { isObject, getEntityFields, getMatchingValues } from '../../../utils';
import { postResponse, HttpCodes, IObject } from '../../../types-interfaces';
import { responderWrongId, responderMissingBodyValue, responder, successResponse, errorResponse } from '../../responders';

const updateFields = (spot: Bathingspot, providedValues: IObject): Bathingspot => {
  // curently silently fails needs some smarter way to set values on entities
  if (isObject(providedValues['apiEndpoints'])) {
    spot.apiEndpoints = providedValues['apiEndpoints'];// 'json' ]
  }// 'json' ]
  if (isObject(providedValues['state'])) {
    spot.state = providedValues['state'];// 'json' ]

  }// 'json' ]
  if (isObject(providedValues['location'])) {
    spot.location = providedValues['location'];// 'json' ]

  }// 'json' ]
  if (typeof providedValues['latitde'] === 'number') {
    spot.latitde = providedValues['latitde'];// 'float8' ]

  }// 'float8' ]
  if (typeof providedValues['longitude'] === 'number') {
    spot.longitude = providedValues['longitude'];// 'float8' ]

  }// 'float8' ]
  if (typeof providedValues['elevation'] === 'number') {
    spot.elevation = providedValues['elevation'];// 'float8' ]
  }// 'float8' ]
  return spot;
}
export const addBathingspotToUser: postResponse = async (request, response) => {

  const example = getEntityFields('Bathingspot');
  if (request.body.hasOwnProperty('name') !== true || request.body.hasOwnProperty('isPublic') !== true) {
    responderMissingBodyValue(response, example);
  }
  try {
  const user = await getUserWithRelations(request.params.userId, ['bathingspots']);

    if (user === undefined) {
      responderWrongId(response);
    } else {
      let spot = new Bathingspot();
      const filteredPropNames = await getEntityFields('Bathingspot');
      const providedValues = getMatchingValues(request.body, filteredPropNames.props);
      spot = updateFields(spot, providedValues);
      const isPublic: boolean = request.body.isPublic;
      const name: string = request.body.name;
      spot.name = name;
      spot.isPublic = isPublic;
      user.bathingspots.push(spot);
      await getManager().save(user);
      const userAgain = await getUserWithRelations(request.params.userId, ['bathingspots']);
      if (userAgain === undefined) {
        throw Error('user id did change user does not exist anymore should never happen');
      }
      responder(response, HttpCodes.successCreated, successResponse('Bathingspot created', [userAgain.bathingspots[userAgain.bathingspots.length - 1]]))
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
}
