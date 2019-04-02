import { getCustomRepository } from 'typeorm';
import { RegionRepository } from '../../repositories/RegionRepository';
import { deleteResponse, HttpCodes } from '../../types-interfaces';
import { errorResponse, responder, responderWrongId, successResponse } from '../responders';

import { SUCCESS } from '../../messages';

export const deleteRegion: deleteResponse = async (request, response) => {
  try {
    const regionRepo = getCustomRepository(RegionRepository);
    const regionId = request.params.regionId;
    const region = await regionRepo.findByIdWithRelations(regionId, ['bathingspots']);
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
