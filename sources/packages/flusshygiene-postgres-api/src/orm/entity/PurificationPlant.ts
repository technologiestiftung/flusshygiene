import {
  Entity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { PPlantMeasurement } from './PPlantMeasurement';
import { Bathingspot } from './Bathingspot';
import { MeasurementType } from './MeasurementType';


@Entity()
export class PurificationPlant extends MeasurementType {


  @OneToMany(_type => PPlantMeasurement, (measurement) => measurement.purificationPlant, {eager: true})
  public measurements!: PPlantMeasurement[];

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.purificationPlants , {
    cascade: true,
    // eager: true,
  })
  public bathingspot!: Bathingspot;
}
