import { Column, Entity, ManyToOne } from 'typeorm';
import { File } from './AbstractFile';
import { Bathingspot } from './Bathingspot';

@Entity()
export class ImageFile extends File {
  @Column({ type: 'text', nullable: false, default: 'png' })
  public type = 'png';

  @ManyToOne((_type) => Bathingspot, (bathingspot) => bathingspot.images, {
    cascade: true,
  })
  public bathingspot!: Bathingspot;
}
