import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Bathingspot } from './Bathingspot';
import { RModelFile } from './RModelFile';

@Entity()
export class BathingspotModel {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Column()
  @CreateDateColumn()
  public createdAt!: Date;
  @VersionColumn()
  public version!: number;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column({ type: 'text', nullable: true, select: false })
  public rmodel!: string;

  @Column({ type: 'bytea', nullable: true, select: false })
  public rmodelBinary!: Buffer;

  @OneToOne((_type) => RModelFile, { eager: true, cascade: true })
  @JoinColumn()
  public rmodelFile!: RModelFile;

  @Column({ type: 'text', nullable: true })
  public comment!: string;
  @Column({ type: 'text', nullable: true })
  public evaluation!: string;

  @ManyToOne((_type) => Bathingspot, (bathingspot) => bathingspot.models, {
    cascade: true,
  })
  public bathingspot!: Bathingspot;
}
