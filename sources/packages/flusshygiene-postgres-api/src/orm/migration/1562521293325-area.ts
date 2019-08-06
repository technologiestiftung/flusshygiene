import { MigrationInterface, QueryRunner } from 'typeorm';

export class area1562521293325 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`);
    // await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`);
  }

  public async down(_queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(POINT,4326)`);
    // await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(POINT,4326)`);
  }
}
