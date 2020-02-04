import { MigrationInterface, QueryRunner } from 'typeorm';

export class Unique1580485866311 implements MigrationInterface {
  name = 'Unique1580485866311';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "p_plant_measurement" DROP CONSTRAINT "UQ_5676c6d2319fe59e3f58c682d70"`,
      undefined,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`,
    //   undefined,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`,
    //   undefined,
    // );
    await queryRunner.query(
      `ALTER TABLE "p_plant_measurement" ADD CONSTRAINT "UQ_CONSTRAIN" UNIQUE ("date", "purificationPlantId")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "p_plant_measurement" DROP CONSTRAINT "UQ_CONSTRAIN"`,
      undefined,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(POINT,4326)`,
    //   undefined,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(POINT,4326)`,
    //   undefined,
    // );
    await queryRunner.query(
      `ALTER TABLE "p_plant_measurement" ADD CONSTRAINT "UQ_5676c6d2319fe59e3f58c682d70" UNIQUE ("dateTime", "date", "purificationPlantId")`,
      undefined,
    );
  }
}
