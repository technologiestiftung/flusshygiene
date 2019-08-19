import { getRepository } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { deleteResponse, HttpCodes } from '../../common';
import { SUCCESS } from '../../messages';
import { getPropsValueGeneric } from '../../utils/get-properties-values-generic';
import { getSpot } from '../../utils/spot-repo-helpers';
import {
  errorResponse,
  responder,
  responderMissingBodyValue,
  responderSuccess,
  responderWrongId,
} from '../responders';

export const deleteBathingspotOfUser: deleteResponse = async (
  request,
  response,
) => {
  const hasForce = getPropsValueGeneric<boolean>(request.body, 'force');
  try {
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const spot: Bathingspot | undefined = await getSpot(userId, spotId);
    if (spot instanceof Bathingspot) {
      if (spot.isPublic === true && hasForce === false) {
        responderMissingBodyValue(response, { force: true });
      } else if (
        (spot.isPublic === true && hasForce === true) ||
        spot.isPublic === false
      ) {
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
