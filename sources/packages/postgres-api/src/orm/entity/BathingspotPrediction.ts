import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Bathingspot } from './Bathingspot';
import { PredictionValue } from '../../lib/common';

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

  @Column({ nullable: true, type: 'float8' })
  public percentile2_5!: number;

  @Column({ nullable: true, type: 'float8' })
  public percentile50!: number;

  @Column({ nullable: true, type: 'float8' })
  public percentile90!: number;

  @Column({ nullable: true, type: 'float8' })
  public percentile95!: number;

  @Column({ nullable: true, type: 'float8' })
  public percentile97_5!: number;

  @Column({ nullable: true, type: 'float8' })
  public credibleInterval2_5!: number;

  @Column({ nullable: true, type: 'float8' })
  public credibleInterval97_5!: number;

  @Column({ nullable: true })
  public oldId!: number;

  @Column({ type: 'timestamp' })
  public date!: Date;

  @Column({ type: 'enum', enum: PredictionValue })
  public prediction!: string;

  @ManyToOne((_type) => Bathingspot, (bathingspot) => bathingspot.predictions, {
    // nullable: true,
    cascade: true,
    // primary: true,
    // eager: true,
  })
  public bathingspot!: Bathingspot;
}
