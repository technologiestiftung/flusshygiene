import { BathingspotRawModelData } from './BathingspotRawModelData';
import { BathingspotModel } from './BathingspotModel';
import { BathingspotPrediction } from './BathingspotPrediction';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { User } from './User';

@Entity()
export class Bathingspot {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'boolean' })
  isPublic!: boolean;

  @Column({type: 'json'})
  apiEndpoints!: string;

  @Column({type: 'json'})
  state!: string;

  // should be geojson
  @Column({type: "json"})
  location!: string;

  @Column({type: 'float8'})
  latitde!: number;
  @Column({type: 'float8'})
  longitude!: number;
  @Column({type: 'float8'})
  elevation!: number;

  @ManyToOne( _type => User, user => user.bathingspots, {
    cascade: true,
  })
  user!: User;

  @OneToMany(_type => BathingspotPrediction, (prediction) => prediction.bathingspot)
  predictions!: BathingspotPrediction[];

  @OneToMany(_type => BathingspotModel, (model) => model.bathingspot)
  models!: BathingspotModel[];

  @OneToMany(_type => BathingspotRawModelData, (rawModelData) => rawModelData.bathingspot)
  rawModelData!: BathingspotRawModelData[];
}

