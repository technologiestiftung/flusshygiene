import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { Bathingspot } from './Bathingspot';
import { Measurement } from './Measurement';

@Entity()
@Unique(['date', 'bathingspot'])
export class GlobalIrradiance extends Measurement {
  @Column({ nullable: true })
  public comment!: string;

  @ManyToOne(
    (_type) => Bathingspot,
    (bathingspot) => bathingspot.globalIrradiances,
    {
      cascade: true,
    },
  )
  public bathingspot!: Bathingspot;
}
