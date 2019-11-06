import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { GenericInput } from './GenericInput';
import { Measurement } from './Measurement';

@Entity()
@Unique(['date', 'genericInput'])
export class GInputMeasurement extends Measurement {
  @Column({ nullable: true })
  public comment!: string;

  @ManyToOne((_type) => GenericInput, (generic) => generic.measurements, {
    cascade: true,
  })
  public genericInput!: GenericInput;
}
