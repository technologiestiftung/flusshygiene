import { getCustomRepository } from 'typeorm';
import { GetById, GetByIds, GetByIdWithRelations } from '../types-interfaces';
import { BathingspotRepository } from './BathingspotRepository';
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
