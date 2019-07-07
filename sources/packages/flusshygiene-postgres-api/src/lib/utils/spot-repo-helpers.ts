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

export const getAllSpotsFromUser: (userId: number) => Promise<Bathingspot[]> = async (userId) => {
  try {
    const spotRepo = getRepository(Bathingspot);
    const query = spotRepo.createQueryBuilder('bathingspot')
      .leftJoinAndSelect('bathingspot.user', 'user')
      .where('user.id = :userId', { userId });
    const spots = await query.getMany();
    return spots;
  } catch (error) {
    return error;
  }

}


export const getSpotWithPredictions: (spotId: number) => Promise<Bathingspot>= async (spotId) => {
  try {
    const repo = getRepository(Bathingspot);
    const query = repo.createQueryBuilder('bathingspot')
      .leftJoinAndSelect("bathingspot.predictions", "predictions")
      .where("bathingspot.id = :id", { id: spotId });
    const spot = await query.getOne();
    return spot;
  } catch (error) {
    return error;
  }
}


// export const findByUserAndSpotId:(userId: number, spotId: number) => Promise<Bathingspot> = async (userId, spotId) => {
//   try {

//     const repo = getRepository(Bathingspot);
//     const query = repo.createQueryBuilder('bathingspot')
//       .innerJoin('bathingspot.user', 'user')
//       .where('user.id = :uid', { uid: userId })
//       .andWhere('bathingspot.id = :sid', { sid: spotId });
//     //  console.log(query);
//     const spot = await query.getOne();
//     return spot;
//   } catch (error) {
//     return error;
//   }
// }


export const findByUserAndRegion:(userId: number, regionId: number) => Promise<Bathingspot[]> = async (userId, regionId) => {
  try {

    const repo = getRepository(Bathingspot);
    const query = repo.createQueryBuilder('bathingspot')
      .innerJoin('bathingspot.user', 'user')
      .where('user.id = :uid', { uid: userId })
      .andWhere('bathingspot.region.id = :regionId', { regionId });
    // console.log(query.getSql());
    return await query.getMany();
  } catch (error) {
    return error;
  }
}

export const findByRegionId: (regionId: number) => Promise<Bathingspot[]>  = async (regionId) => {
  try {
    const repo = getRepository(Bathingspot);
    const query = repo.createQueryBuilder('bathingspot')
      .select('bathingspot').where('bathingspot.region.id = :regionId', { regionId });
    // console.log(query.getSql());
    return await query.getMany();
  } catch (error) {
    return error;
  }
}
