import { Column, Entity } from 'typeorm';
import { File } from './AbstractFile';

@Entity()
export class RModelFile extends File {
  @Column({ type: 'text', nullable: false, default: 'rmodel' })
  public type = 'rmodel';
}
