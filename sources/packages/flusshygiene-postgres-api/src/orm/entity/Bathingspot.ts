import { UpdateDateColumn, VersionColumn } from 'typeorm';
// import {Point, Polygon} from 'geojson';
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { BathingspotMeasurement } from './BathingspotMeasurement';
import { BathingspotModel } from './BathingspotModel';
import { BathingspotPrediction } from './BathingspotPrediction';
import { BathingspotRawModelData } from './BathingspotRawModelData';
import { Region } from './Region';
import { User } from './User';

@Entity()
export class Bathingspot {

  @PrimaryGeneratedColumn()
  public id!: number;
  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @VersionColumn()
  public version!: number;

  @Column({ type: 'boolean', nullable: true})
  public hasPrediction!: boolean;

  @Column({ nullable: true})
  public detailId!: number;

  @Column({ nullable: true})
  public oldId!: number;

  @Column({ nullable: true})
  public measuringPoint!: string;

  @Column()
  public name!: string;

  @Column({ nullable: true})
  public nameLong!: string;

  @Column({ nullable: true})
  public nameLong2!: string;

  @Column({ nullable: true})
  public water!: string;

  @Column({ nullable: true})
  public district!: string;

  @Column({ nullable: true})
  public street!: string;

  @Column({ nullable: true})
  public postalCode!: string;

  @Column({ nullable: true})
  public city!: string;

  @Column({ nullable: true})
  public healthDepartment!: string;

  @Column({ nullable: true})
  public healthDepartmentAddition!: string;
  @Column({ nullable: true})
  public healthDepartmentStreet!: string;
  @Column({ nullable: true})
  public healthDepartmentPostalCode!: number;

  @Column({ nullable: true})
  public healthDepartmentCity!: string;

  @Column({ nullable: true})
  public healthDepartmentMail!: string;

  @Column({ nullable: true})
  public healthDepartmentPhone!: string;

  @Column({ nullable: true})
  public waterRescueThroughDLRGorASB!: boolean;

  @Column({ nullable: true})
  public waterRescue!: string;
  @Column({ nullable: true})
  public lifeguard!: boolean;

  @Column({ nullable: true})
  public hasDisabilityAccesableEntrence!: boolean;

  @Column({ nullable: true})
  public disabilityAccess!: boolean;

  @Column({ nullable: true})
  public disabilityAccessBathrooms!: boolean;

  @Column({ nullable: true})
  public restaurant!: boolean;

  @Column({ nullable: true})
  public snack!: boolean;

  @Column({ nullable: true})
  public parkingSpots!: boolean;

  @Column({ nullable: true})
  public cyanoPossible!: boolean;

  @Column({ nullable: true})
  public bathrooms!: boolean;

  @Column({ nullable: true})
  public bathroomsMobile!: boolean;

  @Column({ nullable: true})
  public dogban!: boolean;

  @Column({ nullable: true})
  public website!: string;

  @Column({ nullable: true})
  public lastClassification!: string;

  @Column({ nullable: true})
  public image!: string;

  @Column({ type: 'boolean' })
  public isPublic!: boolean;

  @Column({type: 'json', nullable: true})
  public apiEndpoints!: string;

  @Column({type: 'json', nullable: true})
  public state!: string;

  // // should be geojson
  @Column({
    nullable: true,
    spatialFeatureType: 'Point',
    srid: 4326,
    type: 'geometry',
  })
  public location!: object;
  @Column({
    nullable: true,
    spatialFeatureType: 'Polygon',
    srid: 4326,
    type: 'geometry',
  })
  public area!: object;

  @Column({type: 'float8', nullable: true})
  public latitude!: number;
  @Column({type: 'float8', nullable: true})
  public longitude!: number;
  @Column({type: 'float8', nullable: true})
  public elevation!: number;

  @ManyToOne( _type => User, user => user.bathingspots)
  public user!: User;

  @OneToMany(_type => BathingspotPrediction, (prediction) => prediction.bathingspot, {eager: true})
  public predictions!: BathingspotPrediction[];

  @OneToMany(_type => BathingspotModel, (model) => model.bathingspot)
  public models!: BathingspotModel[];

  @OneToMany(_type => BathingspotMeasurement, (measurement) => measurement.bathingspot, {eager:  true})
  public measurements!: BathingspotMeasurement[];

  @OneToMany(_type => BathingspotRawModelData, (rawModelData) => rawModelData.bathingspot)
  public rawModelData!: BathingspotRawModelData[];

  @ManyToOne(_type => Region, region => region.bathingspots, {eager: true, onDelete: 'SET NULL'})
  public region!: Region;
}
