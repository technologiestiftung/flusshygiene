import { deleteResponse, HttpCodes } from '../../common';
import { errorResponse, responder, responderWrongId, successResponse } from '../responders';

import { SUCCESS } from '../../messages';
import { findByIdWithRelations } from '../../utils/region-repo-helpers';
import { getRepository } from 'typeorm';
import { Region } from '../../../orm/entity/Region';

export const deleteRegion: deleteResponse = async (request, response) => {
  try {
    const regionRepo = getRepository(Region);
    const regionId = request.params.regionId;
    const region = await findByIdWithRelations(regionId, ['bathingspots']);
    if (region === undefined) {
      responderWrongId(response);
    } else {
      const res = await regionRepo.remove(region);
      responder(response, HttpCodes.success, successResponse(SUCCESS.successDelete200, [res]));
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
