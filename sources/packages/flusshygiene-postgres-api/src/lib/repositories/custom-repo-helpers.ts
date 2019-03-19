import { Bathingspot } from './../../orm/entity/Bathingspot';
import { User } from '../../orm/entity/User';

import { getCustomRepository } from 'typeorm';

import { UserRepository } from './UserRepository';
import { BathingspotRepository } from './BathingspotRepository';

export const getUserWithRelations: (userId: number, relations: string[]) => Promise<User | undefined> = async (userId, relations) => {
  const userRepo = getCustomRepository(UserRepository);
  try {
    const user = await userRepo.findByIdWithRelations(userId, relations);// await getRepository(User)
    return user;
  } catch (e) {
    throw e;
  }
}


export const getBathingspotById: (spotId: number) => Promise<Bathingspot | undefined> = async (spotId: number) => {
  const spotRepo = getCustomRepository(BathingspotRepository);
  try {
    const spot = await spotRepo.findById(spotId);
    return spot;
  } catch (e) {
    throw e;
  }
}

type GetByIds = (userId: number, spotId: number) => Promise<Bathingspot | undefined>;

export const getSpotByUserAndId: GetByIds = async (userId, spotId) => {
  const spotRepo = getCustomRepository(BathingspotRepository);
  try {
    const spot = await spotRepo.findByUserAndSpotId(userId, spotId);
    return spot;
  } catch (e) {
    throw e;
  }
}
