import { Bathingspot } from '../../orm/entity/Bathingspot';
import { getRepository } from 'typeorm';

/**
 * Get a bathingspot by userid and spotid
 *
 */
export const getSpot: (userId: number, spotId: number) => Promise<Bathingspot> = async (userId, spotId) => {
  try {
    const spotRepo = getRepository(Bathingspot);

    const query = spotRepo.createQueryBuilder('bathingspot').innerJoin('bathingspot.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('bathingspot.id = :spotId', { spotId });
    const spot = await query.getOne();
    return spot;
  } catch (error) {
    return error;
  }
}

/**
 * Get a spot by its spotId with a relation defined by a string
 * @param spotId
 * @param relation
 */
export const getSpotWithRelation: (spotId: number, relation: string) => Promise<Bathingspot> = async (spotId, relation) => {
  try {
    const spotRepo = getRepository(Bathingspot);

    const query = spotRepo.createQueryBuilder('bathingspot')
      .leftJoinAndSelect(`bathingspot.${relation}`, relation)
      .where('bathingspot.id = :spotId', { spotId });
    const spotWithRelation = await query.getOne();
    return spotWithRelation;
  } catch (error) {
    return error;
  }
}


/**
 * Get all Bathingspots by a specific user
 */

 export const getAllSpotsFromUser: (userId: number) => Promise<[Bathingspot]> = async (userId) =>{
  try {
    const spotRepo = getRepository(Bathingspot);
    const query = spotRepo.createQueryBuilder('bathingspot')
    .leftJoinAndSelect('bathingspot.user', 'user')
    .where('user.id = :userId', {userId});
    const spots = await query.getMany();
    return spots;
  } catch (error) {
    return error;
  }

 }
