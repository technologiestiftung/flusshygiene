import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAuth0Id1562149560534 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "auth0Id" varchar(255)`);
    // await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`);
  }

  public async down(_queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "auth0Id"`);
    // await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(POINT,4326)`);
  }
}
