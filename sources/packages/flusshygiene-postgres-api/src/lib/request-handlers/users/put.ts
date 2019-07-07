import { getCustomRepository, getRepository } from 'typeorm';
import { Region } from '../../../orm/entity/Region';
import { User } from '../../../orm/entity/User';
import { SUCCESS } from '../../messages';
import { RegionRepository } from '../../repositories/RegionRepository';
import { HttpCodes, putResponse } from '../../common';
import { errorResponse, responder, responderWrongId, successResponse } from '../responders';
import { RegionExsists } from '../../common';
import { getRegionsList } from '../../utils/region-repo-helpers';

// ██████╗ ██╗   ██╗████████╗
// ██╔══██╗██║   ██║╚══██╔══╝
// ██████╔╝██║   ██║   ██║
// ██╔═══╝ ██║   ██║   ██║
// ██║     ╚██████╔╝   ██║
// ╚═╝      ╚═════╝    ╚═╝

const regionExists: RegionExsists = (regions, region) => region === undefined ? false : regions.includes(region);

export const updateUser: putResponse = async (request, response) => {
  try {
    const list = await getRegionsList();
    const user: User | undefined = await getRepository(User).findOne(request.params.userId);
    const region: string|undefined = request.body.region;
    if (user instanceof User)  {
      const userRepository = getRepository(User);
      userRepository.merge(user, request.body);

      const hasRegion = request.body.hasOwnProperty('region');
      const existingRegion = regionExists(list, region);

      if (hasRegion === true && existingRegion === true) {
        const reg = await getCustomRepository(RegionRepository).findByName(request.body.region);
        if (reg instanceof Region) {
          user.regions.push(reg);
        }
      }
      const res = await userRepository.save(user);
      responder(response, HttpCodes.successCreated, successResponse(SUCCESS.success201, [res]));
    } else {
      responderWrongId(response);
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
