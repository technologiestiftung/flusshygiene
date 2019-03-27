import { IsEmail, IsEnum } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './../../lib/types-interfaces';
import { Bathingspot } from './Bathingspot';
import { Questionaire } from './Questionaire';
import { Region } from './Region';
@Entity()
export class User {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false })
  public protected: boolean = false;

  @Column({ nullable: false })
  public firstName!: string;

  @Column({ nullable: false })
  public lastName!: string;

  @Column({ nullable: false })
  @IsEmail()
  public email!: string;
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
