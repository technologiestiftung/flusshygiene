import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Bathingspot } from './Bathingspot';

@Entity()
export class BathingspotModel {

    @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'text'})
  rmodel!: string;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.models, {
    cascade: true,
  })
  bathingspot!: Bathingspot;
}
