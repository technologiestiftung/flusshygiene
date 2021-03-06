import { getRepository } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { getResponse, HttpCodes } from '../../common';
import { SUCCESS } from '../../messages';
import { findByName, getRegionsList } from '../../utils/region-repo-helpers';
import {
  findSpotByRegionId,
  getPublicSpotCount,
} from '../../utils/spot-repo-helpers';
import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
} from '../responders';
import { Pagination } from './../../common/index';

/**
 * Todo: Which properties should be returned
 */
export const getBathingspots: getResponse = async (request, response) => {
  let spots: Bathingspot[];
  try {
    const repo = getRepository(Bathingspot);
    // const skip = request.query.skip;
    // const limit = request.query.limit;
    let limit: number =
      request.query.limit === undefined
        ? Pagination.limit
        : parseInt(request.query.limit, 10);
    const skip: number =
      request.query.skip === undefined
        ? Pagination.skip
        : parseInt(request.query.skip, 10);
    if (limit > Pagination.limit) {
      limit = Pagination.limit;
    }
    const query = repo
      .createQueryBuilder('bathingspot')
      .leftJoinAndSelect('bathingspot.region', 'region')
      .where('bathingspot.isPublic = :isPublic', { isPublic: true })
      .skip(skip)
      .take(limit);
    spots = await query.getMany();
    // spots = await getRepository(Bathingspot).find(
    //   {
    //     where: { isPublic: true },
    //   },
    // );
    let truncated = true;
    if (spots.length === 0 || spots.length < limit) {
      truncated = false;
    }
    responder(
      response,
      HttpCodes.success,
      successResponse(`Public Bathingspots`, spots, truncated, skip, limit),
    );
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
export const getSingleBathingspot: getResponse = async (_request, response) => {
  let spot: Bathingspot | undefined;
  try {
    spot = response.locals.spot; // await getRepository(Bathingspot).findOne(request.params.id);
    if (spot === undefined) {
      responderWrongId(response);
      return;
    }
    responder(
      response,
      HttpCodes.success,
      successResponse(`Bathingspots with id: ${spot.id}`, [spot]),
    );
    return;
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};

export const getBathingspotsByRegion: getResponse = async (
  request,
  response,
) => {
  try {
    // const regionsRepo = getCustomRepository(RegionRepository);
    // let list = await regionsRepo.getNamesList();
    // list = list.map(obj => obj.name);
    //     const res: string[]  = list.map(obj => obj.name);
    const list = await getRegionsList();
    let limit: number =
      request.query.limit === undefined
        ? Pagination.limit
        : parseInt(request.query.limit, 10);
    const skip: number =
      request.query.skip === undefined
        ? Pagination.skip
        : parseInt(request.query.skip, 10);
    if (limit > Pagination.limit) {
      limit = Pagination.limit;
    }
    if (!list.includes(request.params.region)) {
      responderWrongId(response);
    } else {
      // const spotRepo = getCustomRepository(BathingspotRepository);
      const region = await findByName(request.params.region);
      let spots: [] | any = [];
      if (region !== undefined) {
        spots = await findSpotByRegionId(region.id, skip, limit);
        if (spots === undefined) {
          spots = [];
        } else {
          spots = spots.filter((spot: Bathingspot) => spot.isPublic === true);
        }
        let truncated = true;
        if (spots.length === 0 || spots.length < limit) {
          truncated = false;
        }
        responder(
          response,
          HttpCodes.success,
          successResponse(SUCCESS.success200, spots, truncated, skip, limit),
        );
      } else {
        responderWrongId(response);
      }
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};

/**
 * Gets the count of bathingspots from user
 */
export const getPublicSpotsCount: getResponse = async (_request, response) => {
  try {
    const count = await getPublicSpotCount();
    responder(
      response,
      HttpCodes.success,
      successResponse(SUCCESS.success200, [count], false),
    );
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};
