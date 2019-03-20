import { EntityRepository, Repository } from 'typeorm';
import { Bathingspot } from '../../orm/entity/Bathingspot';

@EntityRepository(Bathingspot)
export class BathingspotRepository extends Repository<Bathingspot> {
  public findById(id: number) {
    return this.findOne(id);
  }

  public findByUserAndSpotId(userId: number, spotId: number) {
    // const sqlQuery = this.createQueryBuilder('bathingspot')
    // .where(`"bathingspot"."userId" = ${userId}`)
    // .where('"bathingspot"."userId" = :id', {id: userId})
    // .andWhere('bathingspot.id = :id', {id: spotId}).getSql();
    // console.log(sqlQuery);
    const spot = this.createQueryBuilder('bathingspot')
    .where(`"bathingspot"."userId" = ${userId}`)
    // .where('"bathingspot"."userId" = :id', {id: userId})
    .andWhere('bathingspot.id = :id', {id: spotId}).getOne();
    // console.log('in CustomRepo.findByUserAndSpotId', spot);
    return spot;
  }
}
