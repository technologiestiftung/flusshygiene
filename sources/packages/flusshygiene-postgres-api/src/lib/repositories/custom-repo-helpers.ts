import { getCustomRepository } from 'typeorm';
import { User } from '../../orm/entity/User';
import { Bathingspot } from './../../orm/entity/Bathingspot';
import { BathingspotRepository } from './BathingspotRepository';
import { UserRepository } from './UserRepository';

type GetByIds = (userId: number, spotId: number) => Promise<Bathingspot | undefined>;
type GetById = (spotId: number) => Promise<Bathingspot | undefined>;
type GetByIdWithRelations = (userId: number, relations: string[]) => Promise<User | undefined>;

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
