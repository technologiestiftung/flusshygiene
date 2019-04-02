// import {Point, Polygon} from 'geojson';
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { BathingspotModel } from './BathingspotModel';
import { BathingspotPrediction } from './BathingspotPrediction';
import { BathingspotRawModelData } from './BathingspotRawModelData';
import { Region } from './Region';
import { User } from './User';

@Entity()
export class Bathingspot {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column({ type: 'boolean' })
  public isPublic!: boolean;

  @Column({type: 'json', nullable: true})
  public apiEndpoints!: string;

  @Column({type: 'json', nullable: true})
  public state!: string;

  // // should be geojson
  @Column({
    nullable: true,
    spatialFeatureType: 'Point',
    srid: 4326,
    type: 'geometry',
  })
  public location!: object;
  @Column({
    nullable: true,
    spatialFeatureType: 'Polygon',
    srid: 4326,
    type: 'geometry',
  })
  public area!: object;

  @Column({type: 'float8', nullable: true})
  public latitude!: number;
  @Column({type: 'float8', nullable: true})
  public longitude!: number;
  @Column({type: 'float8', nullable: true})
  public elevation!: number;

  @ManyToOne( _type => User, user => user.bathingspots)
  public user!: User;

  @OneToMany(_type => BathingspotPrediction, (prediction) => prediction.bathingspot)
  public predictions!: BathingspotPrediction[];

  @OneToMany(_type => BathingspotModel, (model) => model.bathingspot)
  public models!: BathingspotModel[];

  @OneToMany(_type => BathingspotRawModelData, (rawModelData) => rawModelData.bathingspot)
  public rawModelData!: BathingspotRawModelData[];
  @ManyToOne(_type => Region, region => region.bathingspots, {eager: true, onDelete: 'SET NULL'})
  public region!: Region;
}
