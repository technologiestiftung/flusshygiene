// import { Polygon } from 'geojson';
import { BeforeRemove,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn } from 'typeorm';
import { Bathingspot } from './Bathingspot';
import { User } from './User';
@Entity()
export class Region {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false })
  public displayName!: string;
  @VersionColumn()
  public version!: number;
  // if he can create badegewässer/bathing spot
  @Column({ type: 'text', nullable: false })
  public name!: string;

  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;
  @Column({
    nullable: true,
    spatialFeatureType: 'Polygon',
    srid: 4326,
    type: 'geometry',
  })
  public area!: object;

  @OneToMany(_type => Bathingspot, bathingspot => bathingspot.user, {
    cascade: true, onDelete: 'SET NULL',
  })
  public bathingspots!: Bathingspot[];

  @ManyToMany(_type => User, user => user.regions, { cascade: true })
  @JoinTable()
  public users!: User[];

  @BeforeRemove()
  public makeSpotsPrivate() {
    this.bathingspots.forEach((spot) => {
      spot.isPublic = false;
      // console.log(spot);
    });
  }
}
