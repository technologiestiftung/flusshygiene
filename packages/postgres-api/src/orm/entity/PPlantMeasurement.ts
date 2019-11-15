import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { Measurement } from './Measurement';
import { PurificationPlant } from './PurificationPlant';

@Entity()
@Unique(['date', 'purificationPlant'])
export class PPlantMeasurement extends Measurement {
  @Column({ nullable: true })
  public comment!: string;

  @ManyToOne((_type) => PurificationPlant, (plant) => plant.measurements, {
    cascade: true,
    // eager: true,
  })
  public purificationPlant!: PurificationPlant;
}
