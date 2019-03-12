import { BathingspotRawModelData } from './BathingspotRawModelData';
import { BathingspotModel } from './BathingspotModel';
import { BathingspotPrediction } from './BathingspotPrediction';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { User } from './User';
import { Region } from './Region';

@Entity()
export class Bathingspot {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'boolean' })
  isPublic!: boolean;

  @Column({type: 'json', nullable: true})
  apiEndpoints!: string;

  @Column({type: 'json', nullable: true})
  state!: string;

  // should be geojson
  @Column({type: "json", nullable: true})
  location!: string;

  @Column({type: 'float8', nullable: true})
  latitde!: number;
  @Column({type: 'float8', nullable: true})
  longitude!: number;
  @Column({type: 'float8', nullable: true})
  elevation!: number;

  @ManyToOne( _type => User, user => user.bathingspots)
  user!: User;

  @OneToMany(_type => BathingspotPrediction, (prediction) => prediction.bathingspot)
  predictions!: BathingspotPrediction[];

  @OneToMany(_type => BathingspotModel, (model) => model.bathingspot)
  models!: BathingspotModel[];

  @OneToMany(_type => BathingspotRawModelData, (rawModelData) => rawModelData.bathingspot)
  rawModelData!: BathingspotRawModelData[];
  @ManyToOne(_type => Region, region => region.bathingspots)
  region!: Region;
}

