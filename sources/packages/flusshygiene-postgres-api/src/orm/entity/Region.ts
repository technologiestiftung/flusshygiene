import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Bathingspot } from './Bathingspot';
import { Regions } from '../../lib/types-interfaces';
import { IsEnum } from 'class-validator';
@Entity()
export class Region {

  @PrimaryGeneratedColumn()
  id!: number;

  // @Column({nullable: false})
  // name!: string;

  // if he can create badegewässer/bathing spot
  @Column({type:'enum', nullable:false, enum: Regions})
  @IsEnum(Regions)
  name!: string;

  @OneToMany(_type => Bathingspot, bathingspot => bathingspot.user,{
    cascade: true
  })
  bathingspots!: Bathingspot[];
};
