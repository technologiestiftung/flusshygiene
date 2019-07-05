import { PurificationPlant } from './PurificationPlant';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Measurement } from './Measurement';

@Entity()
export class PPlantMeasurement extends Measurement {
  @Column({nullable: true})
  comment!: string;

  @ManyToOne( _type => PurificationPlant, plant => plant.measurements , {
    cascade: true,
    // eager: true,
  })
  purificationPlant!: PurificationPlant;
}
