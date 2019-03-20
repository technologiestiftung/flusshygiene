
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Bathingspot } from './Bathingspot';
import { User } from './User';

@Entity()
export class BathingspotRawModelData {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({type: 'timestamp'})
  public lastEdit!: string;

  @Column({type: 'json'})
  public rawData!: string;

  @ManyToOne( _type => User, user => user.questionaires, {
    cascade: true,
  })

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.rawModelData, {
    cascade: true,
  })
  public bathingspot!: Bathingspot;
}
