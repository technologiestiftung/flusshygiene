import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Measurement {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column({ type: 'time', nullable: true })
  public dateTime!: string;

  @Column({ type: 'timestamp', nullable: false })
  public date!: string;

  @Column({ type: 'float8', nullable: false })
  public value!: number;
}
