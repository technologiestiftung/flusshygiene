/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public type!: string;

  @Column()
  @CreateDateColumn()
  public createdAt!: Date;
}
