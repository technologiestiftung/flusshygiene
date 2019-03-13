/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { User } from './User';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

@Entity()
export class Questionaire {

  @PrimaryGeneratedColumn()
    id!: number;

  @Column({type: 'json'})
  state!: string;

  @Column({type:'timestamp'})
  lastEdit!: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne( (_type) => User, user => user.questionaires, {
      cascade: true,
  })
  user!: User;
}
