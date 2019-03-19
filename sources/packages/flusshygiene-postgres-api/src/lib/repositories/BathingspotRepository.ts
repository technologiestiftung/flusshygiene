import { EntityRepository, Repository } from 'typeorm';
import { Bathingspot } from '../../orm/entity/Bathingspot';

@EntityRepository(Bathingspot)
export class BathingspotRepository extends Repository<Bathingspot>{
  findById(id: number) {
    return this.findOne(id);
  }

  findByUserAndSpotId(userId: number, spotId: number){
    // const sqlQuery = this.createQueryBuilder('bathingspot')
    // .where(`"bathingspot"."userId" = ${userId}`)
    // .andWhere('bathingspot.id = :id',{id: spotId}).getSql();
    // console.log(sqlQuery);
    /**
     * Fix: This is unsave code and could leed to sql injection
     */
    const spot = this.createQueryBuilder('bathingspot')
    .where(`"bathingspot"."userId" = ${userId}`)
    // .where('bathingspot.userId = :id', {id: userId})
    .andWhere('bathingspot.id = :id',{id: spotId}).getOne();
    // console.log(spot);
    return spot;
  }
}
