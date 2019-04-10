import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { PredictionValue } from './../../lib/types-interfaces';
import { Bathingspot } from './Bathingspot';

@Entity()
export class BathingspotPrediction {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column()
  public oldId!: number;

  @Column()
  public date!: Date;

  @Column({type: 'enum', enum: PredictionValue})
  public prediction!: string;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.predictions, {
    cascade: true,
  })
  public bathingspot!: Bathingspot;

}
