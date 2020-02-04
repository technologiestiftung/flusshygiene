import {
  BeforeInsert,
  UpdateDateColumn,
  VersionColumn,
  BeforeRemove,
  getRepository,
} from 'typeorm';
// import {Point, Polygon} from 'geojson';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GeometryObject, Polygon } from '@turf/turf';

import { BathingspotMeasurement } from './BathingspotMeasurement';
import { BathingspotModel } from './BathingspotModel';
import { BathingspotPrediction } from './BathingspotPrediction';
import { Discharge } from './Discharge';
import { GenericInput } from './GenericInput';
import { GlobalIrradiance } from './GlobalIrradiance';
import { ImageFile } from './ImageFile';
import { Influences, IMetaData } from '../../lib/common';
import { IsEnum } from 'class-validator';
import { PurificationPlant } from './PurificationPlant';
import { Rain } from './Rain';
// import { BathingspotRawModelData } from './BathingspotRawModelData';
import { Region } from './Region';
import { User } from './User';
import buffer from '@turf/buffer';
import { s3 as awss3 } from '../../lib/s3';
import { S3 } from 'aws-sdk';

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
  { type: 'string', key: 'bwId' },
  { type: 'string', key: 'type' },
  { type: 'string', key: 'coordinateSystem' },
  { type: 'string', key: 'influencePurificationPlant' },
  { type: 'string', key: 'influenceCombinedSewerSystem' },
  { type: 'string', key: 'influenceAgriculture' },
  { type: 'string', key: 'influenceRainwater' },
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

  // this id comes from BWB or Lageso
  @Column({ nullable: true })
  public detailId!: number;

  // official id from the EU
  @Column({ nullable: true })
  public bwId!: string;

  // Ids used on badestellen-berlin.de
  @Column({ nullable: true })
  public oldId!: number;

  /**
   * @todo Which ones are we using create enum?
   */
  @Column({ nullable: true })
  public coordinateSystem!: string;

  /**
   * @todo Which ones are we using create enum?
   */
  @Column({ nullable: true })
  public category!: string;

  @Column({ nullable: true })
  public type!: string;

  @Column({ nullable: true })
  public measuringPoint!: string;

  @Column({ nullable: false })
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

  @Column({ type: 'simple-json', nullable: true })
  public apiEndpoints!: {
    measurementsUrl?: string;
    globalIrradianceUrl?: string;
    dischargesUrl?: string;
  };

  @Column({ type: 'json', nullable: true })
  public state!: string;

  @Column({
    default: Influences.unknown,
    enum: Influences,
    nullable: true,
    type: 'enum',
  })
  @IsEnum(Influences)
  public influencePurificationPlant!: string;

  @Column({
    default: Influences.unknown,
    enum: Influences,
    nullable: true,
    type: 'enum',
  })
  @IsEnum(Influences)
  public influenceCombinedSewerSystem!: string;

  @Column({
    default: Influences.unknown,
    enum: Influences,
    nullable: true,
    type: 'enum',
  })
  @IsEnum(Influences)
  public influenceRainwater!: string;

  @Column({
    default: Influences.unknown,
    enum: Influences,
    nullable: true,
    type: 'enum',
  })
  @IsEnum(Influences)
  public influenceAgriculture!: string;
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

  @ManyToOne((_type) => User, (user) => user.bathingspots)
  public user!: User;

  @OneToMany(
    (_type) => BathingspotPrediction,
    (prediction) => prediction.bathingspot,
    {
      // cascade: true,
      eager: true,
    },
  )
  public predictions!: BathingspotPrediction[];

  // @OneToMany(_type => BathingspotCategory, (category) => category.bathingspot, {
  //   // cascade: true,
  //   eager: true,
  // })
  // public categories!: BathingspotPrediction[];

  @OneToMany((_type) => BathingspotModel, (model) => model.bathingspot, {
    eager: true,
  })
  public models!: BathingspotModel[];

  @OneToMany(
    (_type) => BathingspotMeasurement,
    (measurement) => measurement.bathingspot,
    {
      eager: true,
    },
  )
  public measurements!: BathingspotMeasurement[];

  // @OneToMany(_type => BathingspotRawModelData, (rawModelData) => rawModelData.bathingspot)
  // public rawModelData!: BathingspotRawModelData[];

  @ManyToOne((_type) => Region, (region) => region.bathingspots, {
    eager: true,
    onDelete: 'SET NULL',
  })
  public region!: Region;

  @OneToMany((_type) => PurificationPlant, (plant) => plant.bathingspot)
  public purificationPlants!: PurificationPlant[];

  @OneToMany((_type) => GenericInput, (ginput) => ginput.bathingspot)
  public genericInputs!: GenericInput[];

  @OneToMany((_type) => Discharge, (discharge) => discharge.bathingspot)
  public discharges!: Discharge[];

  @OneToMany(
    (_type) => GlobalIrradiance,
    (globalIrradiance) => globalIrradiance.bathingspot,
  )
  public globalIrradiances!: GlobalIrradiance[];

  @OneToMany((_type) => Rain, (rain) => rain.bathingspot /* { eager: true }*/)
  public rains!: Rain[];

  @OneToMany((_type) => ImageFile, (image) => image.bathingspot)
  public images!: ImageFile[];

  // Listeners

  @BeforeRemove()
  public async removeAllImages() {
    const imageRepo = getRepository(ImageFile);
    const imageFiles = await imageRepo.find({
      where: { bathingspotId: this.id },
    });

    for (const image of imageFiles) {
      const metaData = (image.metaData as unknown) as IMetaData;
      const params: S3.Types.DeleteObjectRequest = {
        Bucket: metaData.bucket,
        Key: metaData.key,
      };
      await awss3.deleteObject(params).promise();
      await imageRepo.remove(image);
    }
  }
  @BeforeInsert()
  public calcGeoJSONPoint() {
    if (this.location === undefined) {
      if (this.latitude !== undefined && this.longitude !== undefined) {
        const geojson = {
          geometry: {
            coordinates: [this.longitude, this.latitude],
            type: 'Point',
          },
          properties: {},
          type: 'Feature',
        };
        this.location = geojson.geometry;
      }
    }
    if (this.area === undefined) {
      if (this.latitude !== undefined && this.longitude !== undefined) {
        // const point = turf.point([this.longitude, this.latitude]);
        // console.log(point);
        const geojson = {
          geometry: {
            coordinates: [this.longitude, this.latitude],
            type: 'Point',
          },
          properties: {},
          type: 'Feature',
        };
        const area = buffer(geojson as GeometryObject, 5, {
          steps: 8,
          units: 'kilometers',
        });
        this.area = area.geometry as Polygon;
        // console.log(this.area);
      }
    }
  }
}
