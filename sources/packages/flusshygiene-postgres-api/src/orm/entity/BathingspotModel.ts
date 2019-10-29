import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
  BeforeRemove,
  getRepository,
} from 'typeorm';
import { Bathingspot } from './Bathingspot';
import { RModelFile } from './RModelFile';
import { PlotFile } from './PlotFile';
import { S3 } from 'aws-sdk';
import { s3 as awss3 } from '../../lib/s3';
import { IMetaData } from '../../lib/common';

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

  @Column({ type: 'text', nullable: true, select: false })
  public rmodel!: string;

  @OneToMany((_type) => RModelFile, (file) => file.model, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public rmodelfiles!: RModelFile[];

  @OneToMany((_type) => PlotFile, (plotFile) => plotFile.model, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public plotfiles!: PlotFile[];
  @Column({ type: 'text', nullable: true })
  public comment!: string;
  @Column({ type: 'text', nullable: true })
  public evaluation!: string;

  @ManyToOne((_type) => Bathingspot, (bathingspot) => bathingspot.models, {
    cascade: true,
  })
  public bathingspot!: Bathingspot;

  // @OneToOne((_type) => Report, { eager: true })
  // @JoinColumn()
  // public report!: Report;

  @BeforeRemove()
  async removeAllRelations() {
    try {
      const plotRepo = getRepository(PlotFile);
      const modelFilesRepo = getRepository(RModelFile);
      const plotFiles = await plotRepo.find({ where: { modelId: this.id } });
      const rmodelFiles = await modelFilesRepo.find({
        where: { modelId: this.id },
      });
      for (const plot of plotFiles) {
        const metaData = (plot.metaData as unknown) as IMetaData;
        const params: S3.Types.DeleteObjectRequest = {
          Bucket: metaData.bucket,
          Key: metaData.key,
        };
        await awss3.deleteObject(params).promise();
        await plotRepo.remove(plot);
      }
      for (const rmodel of rmodelFiles) {
        const metaData = (rmodel.metaData as unknown) as IMetaData;
        const params: S3.Types.DeleteObjectRequest = {
          Bucket: metaData.bucket,
          Key: metaData.key,
        };
        await awss3.deleteObject(params).promise();
        await modelFilesRepo.remove(rmodel);
      }
      // plotFiles
    } catch (error) {}
  }
}
