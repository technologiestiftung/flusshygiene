import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from './User';

@Entity()
export class Questionaire {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'json'})
  state!: string;

  @Column({type:'timestamp'})
  lastEdit!: string;

  @ManyToOne( _type => User, user => user.questionaires, {
    cascade: true,
  })
  user!: User;
}
