import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Bathingspot } from './Bathingspot';

@Entity()
export class BathingspotPrediction {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({type: 'timestamp'})
  public timestamp!: string;

  @Column({type: 'json'})
  public prediction!: string;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.predictions, {
    cascade: true,
    eager: true,
  })
  public bathingspot!: Bathingspot;

}
