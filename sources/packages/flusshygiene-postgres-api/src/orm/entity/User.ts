import { IsEmail, IsEnum } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { UserRole } from '../../lib/common';
import { Bathingspot } from './Bathingspot';
import { Questionaire } from './Questionaire';
import { Region } from './Region';
@Entity()
export class User {

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
  @Column({ nullable: false })
  public protected: boolean = false;

  @Column({ nullable: false })
  public firstName!: string;

  @Column({ nullable: false })
  public lastName!: string;

  @Column({ nullable: false })
  @IsEmail()
  public email!: string;

  @Column({nullable:true})
  public auth0Id!: string;
  // if he can create badegewässer/bathing spot
  @Column({ type: 'enum', nullable: false, enum: UserRole })
  @IsEnum(UserRole)
  public role!: string;

  @OneToMany((_type) => Questionaire, (questionaire) => questionaire.user)
  public questionaires!: Questionaire[];

  @OneToMany(_type => Bathingspot, bathingspot => bathingspot.user, {
    cascade: true,
  })
  public bathingspots!: Bathingspot[];

  @ManyToMany(_type => Region, region => region.users, {
    eager: true,
  })
  public regions!: Region[];

  // listenres
  // @BeforeInsert()
  // public addRegionsToAdmin() {
  //   if (this.role === UserRole.admin) {
  //     getConnection().getRepository(Region).find().then(regions => {
  //       console.log(regions);
  //       this.regions = regions;
  //     }).catch(err => {throw err; });
  //   }
  // }
}
