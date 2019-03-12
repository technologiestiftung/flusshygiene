import { UserRole } from './../../lib/types-interfaces';
import { Questionaire } from './Questionaire';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Bathingspot } from './Bathingspot';
import {IsEmail, IsEnum} from 'class-validator';
@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({nullable: false})
  firstName!: string;

  @Column({nullable: false})
  lastName!: string;

  @Column({nullable: false})
  @IsEmail()
  email!: string;
  // if he can create badegewässer/bathing spot
  @Column({type:'enum', nullable:false, enum: UserRole})
  @IsEnum(UserRole)
  role!: string;

  @OneToMany((_type) => Questionaire, (questionaire) => questionaire.user)
  questionaires!: Questionaire[];

  @OneToMany(_type => Bathingspot, bathingspot => bathingspot.user)
  bathingspots!: Bathingspot[];
};
