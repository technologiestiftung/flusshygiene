import { Entity, Column, ManyToOne } from 'typeorm';
import { Measurement } from './Measurement';
import { Bathingspot } from './Bathingspot';

@Entity()
export class Discharge extends Measurement {
  @Column({nullable: true})
  comment!: string;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.discharges , {
    cascade: true,
  })
  public bathingspot!: Bathingspot;
}
