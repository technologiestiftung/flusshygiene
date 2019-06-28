
import { Column,
  CreateDateColumn,
  Entity,
  // ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn } from 'typeorm';
// import { Bathingspot } from './Bathingspot';
// import { User } from './User';

@Entity()
export class BathingspotRawModelData {

  @PrimaryGeneratedColumn()
  public id!: number;
  @VersionColumn()
  public version!: number;
  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column({type: 'json'})
  public rawData!: string;

  // @ManyToOne( _type => User, user => user.questionaires, {
  //   cascade: true,
  // })

  // @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.rawModelData, {
  //   cascade: true,
  // })
  // public bathingspot!: Bathingspot;
}
