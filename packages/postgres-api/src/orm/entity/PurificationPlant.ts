import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Bathingspot } from './Bathingspot';
import { MeasurementType } from './MeasurementType';
import { PPlantMeasurement } from './PPlantMeasurement';

@Entity()
export class PurificationPlant extends MeasurementType {
  @OneToMany(
    (_type) => PPlantMeasurement,
    (measurement) => measurement.purificationPlant,
    { onDelete: 'CASCADE' },
  )
  public measurements!: PPlantMeasurement[];

  @ManyToOne(
    (_type) => Bathingspot,
    (bathingspot) => bathingspot.purificationPlants,
    {
      cascade: true,
      // eager: true,
    },
  )
  public bathingspot!: Bathingspot;
}
