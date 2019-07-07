import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn} from 'typeorm';
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

  @Column({ nullable: true, type: 'float8'})
  public sicht!: number;

  @Column({type: 'timestamp', nullable: true})
  public date!: Date;

  @Column({ nullable: true, type: 'float8'})
  public conc_ec!: number;

  @Column({ nullable: true})
  public conc_ec_txt!: string;

  @Column({ nullable: true, type: 'float8'})
  public oldId!: number;

  @Column({ nullable: true, type: 'float8'})
  public detailId!: number;

  @Column({ nullable: true, type: 'float8'})
  public conc_ie!: number;

  @Column({ nullable: true})
  public conc_ie_txt!: string;

  @Column({type: 'float8', nullable: true})
  public temp!: number;

  @Column({ nullable: true})
  public algen!: boolean;

  @Column({ nullable: true, type: 'float8'})
  public cb!: number;

  @Column({ nullable: true})
  public sichtTxt!: string;



  @Column({ nullable: true})
  public tempTxt!: string;

  @Column({ nullable: true})
  public algenTxt!: string;

  @Column({ nullable: true})
  @Column({ nullable: true})
  public bsl!: string;

  @Column({ nullable: true})
  public state!: string;

  @Column({ nullable: true, type: 'float8'})
  public wasserqualitaet!: number;

  @Column({ nullable: true})
  public wasserqualitaetTxt!: string;

  @ManyToOne( _type => Bathingspot, bathingspot => bathingspot.measurements , {
    cascade: true,
    // eager: true,
  })
  @JoinColumn()
  public bathingspot!: Bathingspot;

}
