import { MigrationInterface, QueryRunner } from 'typeorm';
import { Influences } from './../../lib/common/index';

export class Influences1566379377544 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "bathingspot" ADD COLUMN "influencePurificationPlant" text DEFAULT '${Influences.unknown}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bathingspot" ADD COLUMN "influenceCombinedSewerSystem" text DEFAULT '${Influences.unknown}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bathingspot" ADD COLUMN "influenceRainwater" text DEFAULT '${Influences.unknown}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bathingspot" ADD COLUMN "influenceAgriculture" text DEFAULT '${Influences.unknown}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "bathingspot" DROP COLUMN "influencePurificationPlant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bathingspot" DROP COLUMN "influenceCombinedSewerSystem"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bathingspot" DROP COLUMN "influenceRainwater"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bathingspot" DROP COLUMN "influenceAgriculture"`,
    );
  }
}
