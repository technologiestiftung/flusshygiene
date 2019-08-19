import { getRepository } from 'typeorm';
import { Region } from '../../../orm/entity/Region';
import { deleteResponse, HttpCodes } from '../../common';
import { SUCCESS } from '../../messages';
import { findByIdWithRelations } from '../../utils/region-repo-helpers';
import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
} from '../responders';

export const deleteRegion: deleteResponse = async (request, response) => {
  try {
    const regionRepo = getRepository(Region);
    const regionId = parseInt(request.params.regionId, 10);
    const region = await findByIdWithRelations(regionId, ['bathingspots']);
    if (region === undefined) {
      responderWrongId(response);
    } else {
      const res = await regionRepo.remove(region);
      responder(
        response,
        HttpCodes.success,
        successResponse(SUCCESS.successDelete200, [res]),
      );
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
