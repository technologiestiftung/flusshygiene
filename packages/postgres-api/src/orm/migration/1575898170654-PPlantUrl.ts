import { MigrationInterface, QueryRunner } from 'typeorm';

export class PPlantUrl1575898170654 implements MigrationInterface {
  name = 'PPlantUrl1575898170654';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "generic_input" ADD COLUMN IF NOT EXISTS "url" text`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "purification_plant" ADD COLUMN IF NOT EXISTS "url" text`,
      undefined,
    );
    // await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`, undefined);
    // await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(POINT,4326)`, undefined);
    // await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(POINT,4326)`, undefined);
    await queryRunner.query(
      `ALTER TABLE "purification_plant" DROP COLUMN "url"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "generic_input" DROP COLUMN "url"`,
      undefined,
    );
  }
}
