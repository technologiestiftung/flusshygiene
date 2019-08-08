import { Column, Entity, ManyToOne } from 'typeorm';
import { Measurement } from './Measurement';
import { PurificationPlant } from './PurificationPlant';

@Entity()
export class PPlantMeasurement extends Measurement {
  @Column({ nullable: true })
  public comment!: string;

  @ManyToOne((_type) => PurificationPlant, (plant) => plant.measurements, {
    cascade: true,
    // eager: true,
  })
  public purificationPlant!: PurificationPlant;
}
