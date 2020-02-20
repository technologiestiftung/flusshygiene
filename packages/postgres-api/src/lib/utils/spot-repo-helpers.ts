import { getRepository, SelectQueryBuilder } from 'typeorm';
import { Bathingspot } from '../../orm/entity/Bathingspot';

export const getSpot: (
  spotId: number,
) => Promise<Bathingspot | undefined> = async (spotId) => {
  try {
    const spot = await getRepository(Bathingspot)
      .createQueryBuilder('bathingspot')
      .where('bathingspot.id = :spotId', { spotId })
      .getOne();
    return spot;
  } catch (error) {
    return error;
  }
};
/**
 * Get a bathingspot by userid and spotid
 *
 */
export const getUsersSpot: (
  userId: number,
  spotId: number,
) => Promise<Bathingspot> = async (userId, spotId) => {
  try {
    const spotRepo = getRepository(Bathingspot);

    const query = spotRepo
      .createQueryBuilder('bathingspot')
      .innerJoin('bathingspot.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('bathingspot.id = :spotId', { spotId });
    const spot = await query.getOne();
    return spot;
  } catch (error) {
    return error;
  }
};

export const getSpotCount: (userId: number) => Promise<number> = async (
  userId,
) => {
  try {
    const spotRepo = getRepository(Bathingspot);

    const query = spotRepo
      .createQueryBuilder('bathingspot')
      .where('"bathingspot"."userId" = :userId', { userId });
    const count = await query.getCount();
    return count;
  } catch (error) {
    return error;
  }
};

export const getPublicSpotCount: () => Promise<number> = async () => {
  try {
    const spotRepo = getRepository(Bathingspot);

    const query = spotRepo
      .createQueryBuilder('bathingspot')
      .where('"bathingspot"."isPublic" = :isPublic', { isPublic: true });
    const count = await query.getCount();
    return count;
  } catch (error) {
    return error;
  }
};

/**
 * Get a spot by its spotId with a relation defined by a string
 * @param spotId
 * @param relation
 */
export const getSpotWithRelation: (
  spotId: number,
  relation: string,
) => Promise<Bathingspot> = async (spotId, relation) => {
  try {
    const spotRepo = getRepository(Bathingspot);
    let query: SelectQueryBuilder<Bathingspot>;
    if (relation === 'models') {
      // const subQuery = getRepository(BathingspotModel)
      //   .createQueryBuilder('bathingspot_models')
      //   .leftJoinAndSelect('bathingspot_models.rmodelfiles', 'rmodelfile');
      // console.log(subQuery.getQuery());
      query = spotRepo
        .createQueryBuilder('bathingspot')
        .leftJoinAndSelect(`bathingspot.${relation}`, relation)
        .leftJoinAndSelect('models.rmodelfiles', 'rmodelfile')
        .leftJoinAndSelect('models.plotfiles', 'plotfile')
        .where('bathingspot.id = :spotId', { spotId });
      // .addSelect((subQuery) => {
      //   return subQuery
      //     .leftJoinAndSelect('bathingspot_models.rmodelfiles', 'rmodelfile')
      //     .from(BathingspotModel, 'bathingspot_models');
      // });
    } else {
      query = spotRepo
        .createQueryBuilder('bathingspot')
        .leftJoinAndSelect(`bathingspot.${relation}`, relation)
        .where('bathingspot.id = :spotId', { spotId });
    }

    const spotWithRelation = await query.getOne();

    return spotWithRelation;
  } catch (error) {
    return error;
  }
};

/**
 * Get all Bathingspots by a specific user
 */

export const getAllSpotsFromUser: (
  userId: number,
  skip: number,
  limit: number,
) => Promise<Bathingspot[]> = async (userId, skip, limit) => {
  try {
    const spotRepo = getRepository(Bathingspot);
    const query = spotRepo
      .createQueryBuilder('bathingspot')
      .leftJoinAndSelect('bathingspot.user', 'user')
      .where('user.id = :userId', { userId })
      .skip(skip)
      .take(limit);
    const spots = await query.getMany();
    return spots;
  } catch (error) {
    return error;
  }
};

export const getSpotWithPredictions: (
  spotId: number,
) => Promise<Bathingspot> = async (spotId) => {
  try {
    const repo = getRepository(Bathingspot);
    const query = repo
      .createQueryBuilder('bathingspot')
      .leftJoinAndSelect('bathingspot.predictions', 'predictions')
      .where('bathingspot.id = :id', { id: spotId });
    const spot = await query.getOne();
    return spot;
  } catch (error) {
    return error;
  }
};

export const findByUserAndRegion: (
  userId: number,
  regionId: number,
  skip: number,
  limit: number,
) => Promise<Bathingspot[]> = async (userId, regionId, skip, limit) => {
  try {
    const repo = getRepository(Bathingspot);
    const query = repo
      .createQueryBuilder('bathingspot')
      .innerJoin('bathingspot.user', 'user')
      .where('user.id = :uid', { uid: userId })
      .andWhere('bathingspot.region.id = :regionId', { regionId })
      .skip(skip)
      .take(limit);
    // console.log(query.getSql());
    return await query.getMany();
  } catch (error) {
    return error;
  }
};

export const findSpotByRegionId: (
  regionId: number,
  skip: number,
  limit: number,
) => Promise<Bathingspot[]> = async (regionId, skip, limit) => {
  try {
    const repo = getRepository(Bathingspot);
    const query = repo
      .createQueryBuilder('bathingspot')
      .select('bathingspot')
      .where('bathingspot.region.id = :regionId', { regionId })
      .skip(skip)
      .take(limit);
    // console.log(query.getSql());
    return await query.getMany();
  } catch (error) {
    return error;
  }
};
