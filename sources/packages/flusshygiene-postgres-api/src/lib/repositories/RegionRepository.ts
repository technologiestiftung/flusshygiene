import { EntityRepository, Repository } from 'typeorm';
import { Region } from '../../orm/entity/Region';

@EntityRepository(Region)
export class RegionRepository extends Repository<Region> {

  public findByName(region: string) {
    return this.findOne({where: {name: region}});
  }
  public findByIdWithRelations(regionId: number, relations: string[]) {
    return this.findOne(regionId, {relations});
  }
  public getNamesList() {
    const query = this.createQueryBuilder('regions')
    .select('name');
    // console.log(query);
    return query.getRawMany();
  }
}
