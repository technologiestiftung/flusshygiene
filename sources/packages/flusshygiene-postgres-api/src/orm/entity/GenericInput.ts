import { Entity, ManyToOne, OneToMany } from 'typeorm';

import { Bathingspot } from './Bathingspot';
import { GInputMeasurement } from './GInputMeasurement';
import { MeasurementType } from './MeasurementType';

@Entity()
export class GenericInput extends MeasurementType {
  @OneToMany(
    (_type) => GInputMeasurement,
    (measurement) => measurement.genericInput,
    { eager: true },
  )
  public measurements!: GInputMeasurement[];

  @ManyToOne(
    (_type) => Bathingspot,
    (bathingspot) => bathingspot.genericInputs,
    {
      cascade: true,
    },
  )
  public bathingspot!: Bathingspot;
}
