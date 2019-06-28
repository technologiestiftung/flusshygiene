import { Entity, Column, ManyToOne } from 'typeorm';
import { Measurement } from './Measurement';
import { GenericInput } from './GenericInput';
@Entity()
export class GInputMeasurement extends Measurement {
  @Column({nullable: true})
  comment!: string;

  @ManyToOne( _type => GenericInput, generic => generic.measurements , {
    cascade: true,
  })
  genericInput!: GenericInput;
}
