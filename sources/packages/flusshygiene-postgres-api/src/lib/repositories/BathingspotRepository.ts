import { EntityRepository, Repository } from 'typeorm';
import { Bathingspot } from '../../orm/entity/Bathingspot';

@EntityRepository(Bathingspot)
export class BathingspotRepository extends Repository<Bathingspot> {
  public findById(id: number) {
    return this.findOne(id);
  }
  public findByIdWithRelations(spotId: number, relations: string[]) {
    return this.findOne(spotId, { relations });
  }

  public findByRegionId(regionId: number) {
    const query = this.createQueryBuilder('bathingspot')
      .select('bathingspot').where('bathingspot.region.id = :regionId', { regionId });
    // console.log(query.getSql());
    return query.getMany();
  }
  public findByUserAndRegion(userId: number, regionId: number) {
    const query = this.createQueryBuilder('bathingspot')
      .innerJoin('bathingspot.user', 'user')
      .where('user.id = :uid', { uid: userId })
      .andWhere('bathingspot.region.id = :regionId', { regionId });
    // console.log(query.getSql());

    return query.getMany();

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

  public getSpotWithPredictions(spotId: number){
    const query = this.createQueryBuilder('bathingspot')
    .leftJoinAndSelect("bathingspot.predictions", "predictions")
    .where("bathingspot.id = :id", { id: spotId });
    const spot = query.getOne();
    return spot;
  }
}
