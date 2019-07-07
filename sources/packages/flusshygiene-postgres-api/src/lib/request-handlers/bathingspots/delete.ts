import { getRepository } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { SUCCESS } from '../../messages';
import { deleteResponse, HttpCodes } from '../../common';
import { getPropsValueGeneric } from '../../utils/get-properties-values-generic';
import {
  errorResponse,
  responder,
  responderMissingBodyValue,
  responderSuccess,
  responderWrongId,
} from '../responders';
import { getSpot } from '../../utils/spot-repo-helpers';

export const deleteBathingspotOfUser: deleteResponse = async (request, response) => {
  const hasForce = getPropsValueGeneric<boolean>(request.body, 'force');
  try {
    const spot: Bathingspot | undefined = await getSpot(request.params.userId, request.params.spotId);
    if (spot instanceof Bathingspot) {
      if (spot.isPublic === true && hasForce === false) {
        responderMissingBodyValue(response, { force: true });
      } else if ((spot.isPublic === true && hasForce === true) || spot.isPublic === false) {
        await getRepository(Bathingspot).remove(spot);
        responderSuccess(response, SUCCESS.successDeleteSpot200);
      } else {
        responderMissingBodyValue(response, { force: true });
      }
    } else {
      responderWrongId(response);
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));

  }
};
