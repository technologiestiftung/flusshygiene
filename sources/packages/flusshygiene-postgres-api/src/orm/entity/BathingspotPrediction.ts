import { Bathingspot } from './Bathingspot';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

@Entity()
export class BathingspotPrediction {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'timestamp'})
  timestamp!: string;

  @Column({type: 'json'})
  prediction!: string;


  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.predictions, {
    cascade: true,
    eager: true,
  })
  bathingspot!: Bathingspot;

}
