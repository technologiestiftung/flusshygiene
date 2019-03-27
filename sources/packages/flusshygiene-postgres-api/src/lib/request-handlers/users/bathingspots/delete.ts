import { getRepository } from 'typeorm';
import { Bathingspot } from '../../../../orm/entity/Bathingspot';
import { SUCCESS } from '../../../messages';
import { getSpotByUserAndId } from '../../../repositories/custom-repo-helpers';
import { deleteResponse, HttpCodes } from '../../../types-interfaces';
import { getPropsValueGeneric } from '../../../utils/get-properties-values';
import {
  errorResponse,
  responder,
  responderMissingBodyValue,
  responderSuccess,
  responderWrongId,
} from '../../responders';

export const deleteBathingspotOfUser: deleteResponse = async (request, response) => {
  const hasForce = getPropsValueGeneric<boolean>(request.body, 'force');
  try {
    const spot: Bathingspot | undefined = await getSpotByUserAndId(request.params.userId, request.params.spotId);
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
