import { Column, Entity, ManyToOne } from 'typeorm';
import { File } from './AbstractFile';
import { BathingspotModel } from './BathingspotModel';

@Entity()
export class RModelFile extends File {
  @Column({ type: 'text', nullable: false, default: 'rmodel' })
  public type = 'rmodel';

  @ManyToOne((_type) => BathingspotModel, (model) => model.rmodelfiles, {
    cascade: true,
  })
  public model!: BathingspotModel;
}
