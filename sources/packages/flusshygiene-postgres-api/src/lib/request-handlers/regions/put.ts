import { getRepository } from 'typeorm';
import { Region } from '../../../orm/entity/Region';
import { SUCCESS } from '../../messages';
import { HttpCodes,  putResponse } from '../../common';
import { errorResponse, responder, responderWrongId, successResponse } from '../responders';
import { createMergeObj } from '../../utils/region-repo-helpers';

export const putRegion: putResponse = async (request, response) => {
  try {
    const regionRepo = getRepository(Region);
    const regionId = request.params.regionId;
    const region = await regionRepo.findOne(regionId);
    if (region === undefined) {
      responderWrongId(response);
    } else {
      const obj = createMergeObj(request.body);

      regionRepo.merge(region, obj);
      await regionRepo.save(region);
      responder(response, HttpCodes.successCreated, successResponse(SUCCESS.success201, [region]));
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
