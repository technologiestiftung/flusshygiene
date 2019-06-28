import { Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn } from 'typeorm';
import { Bathingspot } from './Bathingspot';

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

  @Column({type: 'text'})
  public rmodel!: string;

  @Column({type: 'text', nullable: true})
  public comment!: string;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.models, {
    cascade: true,
  })
  public bathingspot!: Bathingspot;
}
