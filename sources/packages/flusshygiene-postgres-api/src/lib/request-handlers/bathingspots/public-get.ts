import { getCustomRepository, getRepository } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { SUCCESS } from '../../messages';
import { RegionRepository } from '../../repositories/RegionRepository';
import { getResponse, HttpCodes } from '../../common';
import { errorResponse, responder, responderWrongId, successResponse } from '../responders';
import { findByRegionId } from '../../utils/spot-repo-helpers';
import { getRegionsList } from '../../utils/region-repo-helpers';

/**
 * Todo: Which properties should be returned
 */
export const getBathingspots: getResponse = async (_request, response) => {
  let spots: Bathingspot[];
  try {
    const repo = getRepository(Bathingspot);
    const query = repo.createQueryBuilder('bathingspot')
      .leftJoinAndSelect('bathingspot.region','region')
      .where('bathingspot.isPublic = :isPublic', {isPublic: true});
    spots = await query.getMany();
    // spots = await getRepository(Bathingspot).find(
    //   {
    //     where: { isPublic: true },
    //   },
    // );
    responder(response, HttpCodes.success, spots);
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
export const getSingleBathingspot: getResponse = async (request, response) => {
  let spot: Bathingspot | undefined;
  try {
    spot = await getRepository(Bathingspot).findOne(request.params.id);
    if (spot === undefined) {
      responderWrongId(response);
    } else {
      responder(response, HttpCodes.success, [spot]);
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};

export const getBathingspotsByRegion: getResponse = async (request, response) => {
  try {
    // const regionsRepo = getCustomRepository(RegionRepository);
    // let list = await regionsRepo.getNamesList();
    // list = list.map(obj => obj.name);
    //     const res: string[]  = list.map(obj => obj.name);
    const list = await getRegionsList();

    if (!(list.includes(request.params.region))) {
      responderWrongId(response);
    } else {
      const regionRepo = getCustomRepository(RegionRepository);
      // const spotRepo = getCustomRepository(BathingspotRepository);
      const region = await regionRepo.findByName(request.params.region);
      let spots: []|any = [];
      if (region !== undefined) {
        spots = await findByRegionId(region.id);
        if (spots === undefined) {
          spots = [];
        } else {
          spots = spots.filter((spot: Bathingspot) => spot.isPublic === true );
        }
        responder(response, HttpCodes.success, successResponse(SUCCESS.success200, spots));
      } else {
        responderWrongId(response);
      }
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
