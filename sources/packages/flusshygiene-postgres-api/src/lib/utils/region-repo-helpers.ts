import { Region } from './../../orm/entity/Region';
import { isObject } from '.';
import { IObject, IRegionListEntry } from '../common';
import { getRepository } from 'typeorm';

const criteria = [
  { type: 'string', key: 'name' },
  { type: 'string', key: 'displayName' },
  { type: 'object', key: 'area' },
];

export const createMergeObj: (obj: any) => IObject = (obj) => {
  const res: IObject = {};

  criteria.forEach((criterion) => {
    const value = obj[criterion.key];
    switch (criterion.type) {
      case 'object':
        if (isObject(value)) {
          res.area = value.geometry;
        }
        break;
      default:
        if (typeof value === criterion.type) {
          res[criterion.key] = value;
        }
    }
  });
  return res;
};


export const findByName: (region: string) => Promise<Region> = async (region) => {
  try {
    const repo = getRepository(Region);
    return await repo.findOne({ where: { name: region } });

  } catch (error) {
    return error;
  }
}
export const findByIdWithRelations: (regionId: number, relations: string[]) => Promise<Region> = (regionId: number, relations: string[]) => {
  try {
    const repo = getRepository(Region);
    return repo.findOne(regionId, { relations });
  } catch (error) {
    return error;
  }
}

const getNamesList: () => Promise<any[]> = async () => {
  const repo = getRepository(Region);
  try {

    const query = await repo.createQueryBuilder('regions')
      .select('name');
    // console.log(query);
    return await query.getRawMany();
  } catch (error) {
    return error;
  }
}


export const getRegionsList: () => Promise<string[]> = async () => {
  try {
    // const regionsRepo = getCustomRepository(RegionRepository);
    const list: IRegionListEntry[] = await  getNamesList();
    const res: string[]  = list.map(obj => obj.name);
    return res;
  } catch (e) {
    throw e;
  }
};
