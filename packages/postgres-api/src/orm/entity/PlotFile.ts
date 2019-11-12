import { BathingspotModel } from './BathingspotModel';
import { Column, Entity, ManyToOne } from 'typeorm';
import { File } from './AbstractFile';

@Entity()
export class PlotFile extends File {
  @Column({ type: 'text', nullable: false, default: 'svg' })
  public type = 'svg';

  @ManyToOne((_type) => BathingspotModel, (model) => model.plotfiles, {
    cascade: true,
  })
  public model!: BathingspotModel;

  @Column({ type: 'text' })
  public title!: string;

  @Column({ type: 'text' })
  public description!: string;
}
