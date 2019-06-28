import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { PredictionValue } from '../../lib/common';
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

  @Column({nullable: true})
  public percentile2_5!: number;

  @Column({nullable: true})
  public percentile50!: number;

  @Column({nullable: true})
  public percentile90!: number;

  @Column({nullable: true})
  public percentile95!: number;

  @Column({nullable: true})
  public percentile97_5!: number;

  @Column({nullable: true})
  public credibleInterval2_5!: number;

  @Column({nullable: true})
  public credibleInterval97_5!: number;

  @Column({nullable: true})
  public oldId!: number;

  @Column()
  public date!: Date;

  @Column({type: 'enum', enum: PredictionValue})
  public prediction!: string;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.predictions,
    {
      // nullable: true,
      cascade: true,
      // primary: true,
      // eager: true,
    })
  public bathingspot!: Bathingspot;

}
