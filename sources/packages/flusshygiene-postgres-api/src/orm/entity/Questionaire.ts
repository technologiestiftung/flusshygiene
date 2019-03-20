/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Questionaire {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'json' })
  public state!: string;

  @Column({ type: 'timestamp' })
  public lastEdit!: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, user => user.questionaires, {
    cascade: true,
  })
  public user!: User;
}
