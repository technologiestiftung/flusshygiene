import { getRepository } from 'typeorm';
import { Bathingspot } from '../../../../orm/entity/Bathingspot';
import { SUCCESS } from '../../../messages';
import { getSpotByUserAndId } from '../../../repositories/custom-repo-helpers';
import { deleteResponse, HttpCodes } from '../../../types-interfaces';
import {
  errorResponse,
  responder,
  responderMissingBodyValue,
  responderSuccess,
  responderWrongId,
} from '../../responders';

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
};
