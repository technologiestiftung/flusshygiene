import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { Bathingspot } from './Bathingspot';

@Entity()
export class BathingspotMeasurement {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column({ nullable: true})
  public sicht!: number;

  @Column({type: 'timestamp', nullable: true})
  public date!: Date;

  @Column({ nullable: true})
  public eco!: number;

  @Column({ nullable: true})
  public oldId!: number;

  @Column({ nullable: true})
  public detailId!: number;

  @Column({ nullable: true})
  public ente!: number;

  @Column({type: 'float', nullable: true})
  public temp!: number;

  @Column({ nullable: true})
  public algen!: boolean;

  @Column({ nullable: true})
  public cb!: number;

  @Column({ nullable: true})
  public sichtTxt!: string;

  @Column({ nullable: true})
  public ecoTxt!: string;

  @Column({ nullable: true})
  public enteTxt!: string;

  @Column({ nullable: true})
  public tempTxt!: string;

  @Column({ nullable: true})
  public algenTxt!: string;

  @Column({ nullable: true})
  @Column({ nullable: true})
  public bsl!: string;

  @Column({ nullable: true})
  public state!: string;

  @Column({ nullable: true})
  public wasserqualitaet!: boolean;

  @Column({ nullable: true})
  public wasserqualitaetTxt!: boolean;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.measurements , {
    cascade: true,
  })
  public bathingspot!: Bathingspot;

}
