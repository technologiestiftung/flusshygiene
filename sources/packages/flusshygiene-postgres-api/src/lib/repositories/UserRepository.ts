import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../orm/entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public findByIdWithRelations(userId: number, relations: string[]) {
    return this.findOne(userId, { relations });
  }

  // public findUserBySpotId(spotId: number) {
  //   // const query = this.createQueryBuilder('user')
  //   // .innerJoin('user.bathingspots', 'bathingspot')
  //   // .where('bathingspot.id = :sid', {sid: spotId});
  //   // // console.log(query.getSql());
  //   return this.createQueryBuilder('user')
  //   .innerJoin('user.bathingspots', 'bathingspot')
  //   .where('bathingspot.id = :sid', {sid: spotId}).getMany();

  //   // return user;

  // }

  public findAllByRole(role: string) {
    return this.find({where: {role}});
  }
  // findbyIdAndBathingspotById(userId: number, relationId: number) {
  //   const sqlQuery = this.createQueryBuilder('user').leftJoinAndSelect('user.bathingspots', 'bathingspot')
  //   .where('user.id = :id', {id: userId})
  //   .andWhere('bathingspot_id = :id', {id: relationId}).getSql();
  //   console.log(sqlQuery);

  //   const user = this.createQueryBuilder('user').leftJoinAndSelect('user.bathingspots', 'bathingspot')
  //   .where('user.id = :id', {id: userId})
  //   .andWhere('bathingspot.id = :id', {id: relationId}).getOne();
  //   return user;
    // return this.findOne(userId, {relations:[relation], where:{id: relationId}});

  // }
}
