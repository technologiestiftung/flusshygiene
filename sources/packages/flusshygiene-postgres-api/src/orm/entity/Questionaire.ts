/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Questionaire {

  @PrimaryGeneratedColumn()
  public id!: number;
  @VersionColumn()
  public version!: number;
  @Column({ type: 'json' })
  public state!: string;

  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, user => user.questionaires, {
    cascade: true,
  })
  public user!: User;
}
