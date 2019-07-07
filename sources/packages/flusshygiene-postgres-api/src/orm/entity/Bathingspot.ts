
import { UpdateDateColumn, VersionColumn, BeforeInsert } from 'typeorm';
// import {Point, Polygon} from 'geojson';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BathingspotMeasurement } from './BathingspotMeasurement';
import { BathingspotModel } from './BathingspotModel';
import { BathingspotPrediction } from './BathingspotPrediction';
// import { BathingspotRawModelData } from './BathingspotRawModelData';
import { Region } from './Region';
import { User } from './User';
import { PurificationPlant } from './PurificationPlant';
import { Discharge } from './Discharge';
import { Rain } from './Rain';
import { GlobalIrradiance } from './GlobalIrradiance';
import { GenericInput } from './GenericInput';
import { GeometryObject, Polygon } from '@turf/turf';
import buffer from '@turf/buffer'

export const criteriaBathingspot = [
  { type: 'object', key: 'apiEndpoints' },
  { type: 'object', key: 'state' },
  { type: 'number', key: 'latitude' },
  { type: 'number', key: 'oldId' },
  { type: 'number', key: 'longitude' },
  { type: 'number', key: 'elevation' },
  { type: 'string', key: 'name' },
  { type: 'boolean', key: 'isPublic' },
  { type: 'geometry', key: 'area' },
  { type: 'geometry', key: 'location' },
  { type: 'number', key: 'detailId' },
  { type: 'string', key: 'measuringPoint' },
  { type: 'string', key: 'name' },
  { type: 'string', key: 'nameLong' },
  { type: 'string', key: 'nameLong2' },
  { type: 'string', key: 'water' },
  { type: 'string', key: 'district' },
  { type: 'string', key: 'street' },
  { type: 'number', key: 'postalCode' },
  { type: 'string', key: 'city' },
  { type: 'string', key: 'healthDepartment' },
  { type: 'string', key: 'healthDepartmentAddition' },
  { type: 'string', key: 'healthDepartmentStreet' },
  { type: 'number', key: 'healthDepartmentPostalCode' },
  { type: 'string', key: 'healthDepartmentCity' },
  { type: 'string', key: 'healthDepartmentMail' },
  { type: 'string', key: 'healthDepartmentPhone' },
  { type: 'string', key: 'waterRescue' },
  { type: 'boolean', key: 'waterRescueThroughDLRGorASB' },
  { type: 'boolean', key: 'lifeguard' },
  { type: 'boolean', key: 'disabilityAccess' },
  { type: 'boolean', key: 'hasDisabilityAccesableEntrence' },
  { type: 'boolean', key: 'disabilityAccessBathrooms' },
  { type: 'boolean', key: 'restaurant' },
  { type: 'boolean', key: 'snack' },
  { type: 'boolean', key: 'parkingSpots' },
  { type: 'boolean', key: 'cyanoPossible' },
  { type: 'boolean', key: 'bathrooms' },
  { type: 'boolean', key: 'bathroomsMobile' },
  { type: 'boolean', key: 'hasPrediction' },
  { type: 'boolean', key: 'isPublic' },
  { type: 'boolean', key: 'dogban' },
  { type: 'string', key: 'website' },
  { type: 'string', key: 'lastClassification' },
  { type: 'string', key: 'image' },
];

export const geomCriteria = [
  { type: 'string', key: 'type' },
  { type: 'array', key: 'coordinates' },
];

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

  @Column({ type: 'boolean', nullable: true })
  public hasPrediction!: boolean;

  @Column({ nullable: true})
  public detailId!: number;

  @Column({ nullable: true })
  public oldId!: number;

  @Column({ nullable: true })
  public measuringPoint!: string;

  @Column()
  public name!: string;

  @Column({ nullable: true })
  public nameLong!: string;

  @Column({ nullable: true })
  public nameLong2!: string;

  @Column({ nullable: true })
  public water!: string;

  @Column({ nullable: true })
  public district!: string;

  @Column({ nullable: true })
  public street!: string;

  @Column({ nullable: true })
  public postalCode!: string;

  @Column({ nullable: true })
  public city!: string;

  @Column({ nullable: true })
  public healthDepartment!: string;

  @Column({ nullable: true })
  public healthDepartmentAddition!: string;
  @Column({ nullable: true })
  public healthDepartmentStreet!: string;
  @Column({ nullable: true })
  public healthDepartmentPostalCode!: number;

  @Column({ nullable: true })
  public healthDepartmentCity!: string;

  @Column({ nullable: true })
  public healthDepartmentMail!: string;

  @Column({ nullable: true })
  public healthDepartmentPhone!: string;

  @Column({ nullable: true })
  public waterRescueThroughDLRGorASB!: boolean;

  @Column({ nullable: true })
  public waterRescue!: string;

  @Column({ nullable: true })
  public lifeguard!: boolean;

  @Column({ nullable: true })
  public hasDisabilityAccesableEntrence!: boolean;

  @Column({ nullable: true })
  public disabilityAccess!: boolean;

  @Column({ nullable: true })
  public disabilityAccessBathrooms!: boolean;

  @Column({ nullable: true })
  public restaurant!: boolean;

  @Column({ nullable: true })
  public snack!: boolean;

  @Column({ nullable: true })
  public parkingSpots!: boolean;

  @Column({ nullable: true })
  public cyanoPossible!: boolean;

  @Column({ nullable: true })
  public bathrooms!: boolean;

  @Column({ nullable: true })
  public bathroomsMobile!: boolean;

  @Column({ nullable: true })
  public dogban!: boolean;

  @Column({ nullable: true })
  public website!: string;

  @Column({ nullable: true })
  public lastClassification!: string;

  @Column({ nullable: true })
  public image!: string;

  @Column({ type: 'boolean' })
  public isPublic!: boolean;

  @Column({ type: 'json', nullable: true })
  public apiEndpoints!: string;

  @Column({ type: 'json', nullable: true })
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

  @Column({ type: 'float8', nullable: true })
  public latitude!: number;
  @Column({ type: 'float8', nullable: true })
  public longitude!: number;
  @Column({ type: 'float8', nullable: true })
  public elevation!: number;

  @ManyToOne(_type => User, user => user.bathingspots)
  public user!: User;

  @OneToMany(_type => BathingspotPrediction, (prediction) => prediction.bathingspot, {
    // cascade: true,
    eager: true,
  })
  public predictions!: BathingspotPrediction[];


  @OneToMany(_type => BathingspotModel, (model) => model.bathingspot, {
    eager: true,
  })
  public models!: BathingspotModel[];

  @OneToMany(_type => BathingspotMeasurement, (measurement) => measurement.bathingspot, {
    eager: true,
  })
  public measurements!: BathingspotMeasurement[];

  // @OneToMany(_type => BathingspotRawModelData, (rawModelData) => rawModelData.bathingspot)
  // public rawModelData!: BathingspotRawModelData[];

  @ManyToOne(_type => Region, region => region.bathingspots, { eager: true, onDelete: 'SET NULL' })
  public region!: Region;

  @OneToMany(_type => PurificationPlant, (plant) => plant.bathingspot)
  public purificationPlants!: PurificationPlant[];

  @OneToMany(_type => GenericInput, (ginput) => ginput.bathingspot)
  public genericInputs!: GenericInput[];


  @OneToMany(_type => Discharge, (discharge) => discharge.bathingspot)
  public discharges!: Discharge[];

  @OneToMany(_type => GlobalIrradiance, (globalIrradiance) => globalIrradiance.bathingspot)
  public globalIrradiances!: GlobalIrradiance[];

  @OneToMany(_type => Rain, (rain) => rain.bathingspot)
  public rains!: Rain[];

  // Listeners

  @BeforeInsert()
  calcGeoJSONPoint() {
    if (this.location === undefined) {
      if (this.latitude !== undefined && this.longitude !== undefined) {
        const geojson = {
          properties: {},
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [this.longitude, this.latitude]
          }
        }
        this.location = geojson.geometry;
      }
    }
    if (this.area === undefined) {
      if (this.latitude !== undefined && this.longitude !== undefined) {

        // const point = turf.point([this.longitude, this.latitude]);
        // console.log(point);
        const geojson = {
          properties: {},
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [this.longitude, this.latitude]
          }
        }
        const area = buffer(geojson as GeometryObject, 5, { units: 'kilometers' });
        this.area = area.geometry as Polygon;
        // console.log(this.area);
      }
    }
  }
}
