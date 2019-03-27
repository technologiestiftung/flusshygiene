import { getCustomRepository } from 'typeorm';
import { Region } from '../../orm/entity/Region';
import { GetById, GetByIds, GetByIdWithRelations } from '../types-interfaces';
import { IRegionListEntry } from './../types-interfaces';
import { BathingspotRepository } from './BathingspotRepository';
import { RegionRepository } from './RegionRepository';
import { UserRepository } from './UserRepository';

export const getUserWithRelations: GetByIdWithRelations = async (userId, relations) => {
  const userRepo = getCustomRepository(UserRepository);
  try {
    const user = await userRepo.findByIdWithRelations(userId, relations); // await getRepository(User)
    return user;
  } catch (e) {
    throw e;
  }
};

export const getBathingspotById: GetById = async (spotId: number) => {
  const spotRepo = getCustomRepository(BathingspotRepository);
  try {
    const spot = await spotRepo.findById(spotId);
    return spot;
  } catch (e) {
    throw e;
  }
};

export const getSpotByUserAndId: GetByIds = async (userId, spotId) => {
  const spotRepo = getCustomRepository(BathingspotRepository);
  try {
    const spot = await spotRepo.findByUserAndSpotId(userId, spotId);
    return spot;
  } catch (e) {
    throw e;
  }
};

export const getRegionsList: () => Promise<string[]> = async () => {
  try {

    const regionsRepo = getCustomRepository(RegionRepository);
    const list: IRegionListEntry[] = await regionsRepo.getNamesList();
    const res: string[]  = list.map(obj => obj.name);
    return res;
  } catch (e) {
    throw e;
  }
};

export const getRegionByName: (region: string) => Promise<Region|undefined> = async (region) => {
  try {
    const repo = getCustomRepository(RegionRepository);
    const res =  await repo.findByName(region);
    return res;
  } catch (e) {
    throw e;
  }
};
