import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Bathingspot } from './Bathingspot';

@Entity()
export class BathingspotModel {

    @PrimaryGeneratedColumn()
  public id!: number;

  @Column({type: 'text'})
  public rmodel!: string;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.models, {
    cascade: true,
  })
  public bathingspot!: Bathingspot;
}
