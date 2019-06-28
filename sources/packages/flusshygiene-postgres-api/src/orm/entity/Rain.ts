import { Entity, Column, ManyToOne } from 'typeorm';
import { Measurement } from './Measurement';
import { Bathingspot } from './Bathingspot';

@Entity()
export class Rain extends Measurement {
  @Column({nullable: true})
  comment!: string;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.rains , {
    cascade: true,
  })
  public bathingspot!: Bathingspot;
}
