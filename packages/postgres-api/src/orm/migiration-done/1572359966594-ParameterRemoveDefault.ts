import { MigrationInterface, QueryRunner } from 'typeorm';

export class ParameterRemoveDefault1572359966594 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "bathingspot_model" ALTER COLUMN "parameter" DROP DEFAULT`,
      undefined,
    );
    // await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`, undefined);
    // await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(
    //   `ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(POINT,4326)`,
    //   undefined,
    // );
    // await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(POINT,4326)`, undefined);
    await queryRunner.query(
      `ALTER TABLE "bathingspot_model" ALTER COLUMN "parameter" SET DEFAULT 'conc_ec'`,
      undefined,
    );
  }
}
