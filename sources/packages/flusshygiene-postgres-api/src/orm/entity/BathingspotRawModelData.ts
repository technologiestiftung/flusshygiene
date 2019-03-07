
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from './User';
import { Bathingspot } from './Bathingspot';

@Entity()
export class BathingspotRawModelData {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'timestamp'})
  lastEdit!: string;

  @Column({type: 'json'})
  rawData!:string;

  @ManyToOne( _type => User, user => user.questionaires, {
    cascade: true,
  })


  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.rawModelData, {
    cascade: true,
  })
  bathingspot!: Bathingspot;
}
