import { EntityRepository, Repository } from 'typeorm';
import { Bathingspot } from './../../orm/entity/Bathingspot';

@EntityRepository(Bathingspot)
export class BathingspotRepository extends Repository<Bathingspot> {
  public findById(id: number) {
    return this.findOne(id);
  }

  public findByRegionId(regionId: number) {
    const query = this.createQueryBuilder('bathingspot')
      .select('bathingspot').where('bathingspot.region.id = :regionId', { regionId });
    // console.log(query.getSql());
    return query.getMany();
  }
  public findByUserAndRegion(userId: number, regionId: number) {
    // const pRegion = this.manager.getCustomRepository(RegionRepository).findByName(region);
    // pRegion.then(reg => {
    const query = this.createQueryBuilder('bathingspot')
      .innerJoin('bathingspot.user', 'user')
      .where('user.id = :uid', { uid: userId })
      .andWhere('bathingspot.region.id = :regionId', { regionId });
    // console.log(query.getSql());

    return query.getMany();

    // }).catch(_err => {
    //   return undefined;
    // });
  }
  public findByUserAndSpotId(userId: number, spotId: number) {

    const query = this.createQueryBuilder('bathingspot')
      .innerJoin('bathingspot.user', 'user')
      .where('user.id = :uid', { uid: userId })
      .andWhere('bathingspot.id = :sid', { sid: spotId });
    //  console.log(query);
    const spot = query.getOne();
    return spot;
  }
}
