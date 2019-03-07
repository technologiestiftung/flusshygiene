import { Questionaire } from './Questionaire';
import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Bathingspot } from './Bathingspot';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
  id!: number;

    @Column()
  firstName!: string;

    @Column()
  lastName!: string;

  // if he can create badegewässer/bathing spot
    @Column()
  role!: string;

  @OneToMany((_type)=> Questionaire, (questionaire) => questionaire.user)
  questionaires!: Questionaire[];

  @OneToMany(_type => Bathingspot, bathingspot => bathingspot.user)
  bathingspots!: Bathingspot[];
};
