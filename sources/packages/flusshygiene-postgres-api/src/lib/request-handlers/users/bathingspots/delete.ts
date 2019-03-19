import { deleteResponse, HttpCodes } from '../../../types-interfaces';
import { responder, errorResponse, responderWrongId, responderMissingBodyValue, responderSuccess } from '../../responders';
import { getSpotByUserAndId } from '../../../repositories/custom-repo-helpers';
import { Bathingspot } from '../../../../orm/entity/Bathingspot';
import { getRepository } from 'typeorm';
import { SUCCESS } from '../../../messages';

export const deleteBathingspotOfUser: deleteResponse = async (request, response) => {
  // console.log(request.params);
  // console.log(request.body);
  try {
    const spot: Bathingspot | undefined = await getSpotByUserAndId(request.params.userId, request.params.spotId);
    if (spot === undefined) {
      responderWrongId(response);
    } else {

      if (spot.isPublic === true && (request.body.force === false || request.body.hasOwnProperty('force') === false)) {
        // console.log('spot is public');
        // console.log('no force applied');
        responderMissingBodyValue(response, { force: true });
      } else {
        await getRepository(Bathingspot).remove(spot);
        // console.log(res);
        responderSuccess(response, SUCCESS.successDeleteSpot200);
      }
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));

  }
}
