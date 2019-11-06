import { MigrationInterface, QueryRunner } from 'typeorm';

export class Parameter1572359451189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE "bathingspot_model_parameter_enum" AS ENUM('conc_ie', 'conc_ec')`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "bathingspot_model" ADD "parameter" "bathingspot_model_parameter_enum" NOT NULL DEFAULT 'conc_ec'`,
      undefined,
    );
    // await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`, undefined);
    // await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(POINT,4326)`, undefined);
    // await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(POINT,4326)`, undefined);
    await queryRunner.query(
      `ALTER TABLE "bathingspot_model" DROP COLUMN "parameter"`,
      undefined,
    );
    await queryRunner.query(
      `DROP TYPE "bathingspot_model_parameter_enum"`,
      undefined,
    );
  }
}
