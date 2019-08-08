import { Column, Entity, ManyToOne } from 'typeorm';
import { GenericInput } from './GenericInput';
import { Measurement } from './Measurement';
@Entity()
export class GInputMeasurement extends Measurement {
  @Column({ nullable: true })
  public comment!: string;

  @ManyToOne((_type) => GenericInput, (generic) => generic.measurements, {
    cascade: true,
  })
  public genericInput!: GenericInput;
}
