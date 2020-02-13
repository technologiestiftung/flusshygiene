import {
  Entity,
  ManyToOne,
  OneToMany,
  BeforeRemove,
  getRepository,
} from 'typeorm';

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
      onDelete: 'CASCADE',
    },
  )
  public bathingspot!: Bathingspot;

  @BeforeRemove()
  async removeAllRelations() {
    try {
      const gimRepo = getRepository(GInputMeasurement);
      const gims = await gimRepo.find({ where: { genericInputId: this.id } });
      for (const gim of gims) {
        await gimRepo.remove(gim);
      }
    } catch (error) {
      throw error;
    }
  }
}
