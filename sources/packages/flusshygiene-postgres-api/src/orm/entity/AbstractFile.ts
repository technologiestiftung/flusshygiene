import { Column } from 'typeorm';
import { AbstractItem } from './AbstractItem';

export abstract class File extends AbstractItem {
  @Column({ type: 'text', nullable: false, enum: ['png', 'rmodel'] })
  public type!: string;

  @Column({ type: 'text', nullable: false })
  public url!: string;

  @Column({ type: 'json', nullable: true })
  public metaData: any;
}
