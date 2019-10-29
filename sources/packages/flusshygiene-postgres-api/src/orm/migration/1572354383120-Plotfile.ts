import { MigrationInterface, QueryRunner } from 'typeorm';

export class Plotfile1572354383120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "discharge" DROP CONSTRAINT "UQ_d34d200330ccfdb0e3f6b496b7f"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "g_input_measurement" DROP CONSTRAINT "UQ_bbdec007356671e7d1d069e6e28"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "global_irradiance" DROP CONSTRAINT "UQ_06ff7473dccb21f7e603331f679"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "rain" DROP CONSTRAINT "UQ_c0592b053d8bb9c3eb8220a17e4"`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "plot_file" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "type" text NOT NULL, "url" text NOT NULL, "metaData" json, "title" text NOT NULL, "description" text NOT NULL, "modelId" integer, CONSTRAINT "PK_37a0a8afe1d2bda968dcb036e1e" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "discharge" ADD CONSTRAINT "UQ_ac423b39b01f9f8ffe63d85b30e" UNIQUE ("date", "bathingspotId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "g_input_measurement" ADD CONSTRAINT "UQ_f6bc7cda7c1fc36952ec808f92d" UNIQUE ("date", "genericInputId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "global_irradiance" ADD CONSTRAINT "UQ_5ad8983ccbcab375efd32e70da8" UNIQUE ("date", "bathingspotId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "rain" ADD CONSTRAINT "UQ_a5fc0ae8767f9add37c32f8c89d" UNIQUE ("date", "bathingspotId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "plot_file" ADD CONSTRAINT "FK_71d584af7562b79b9333ce6b53f" FOREIGN KEY ("modelId") REFERENCES "bathingspot_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "plot_file" DROP CONSTRAINT "FK_71d584af7562b79b9333ce6b53f"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "rain" DROP CONSTRAINT "UQ_a5fc0ae8767f9add37c32f8c89d"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "global_irradiance" DROP CONSTRAINT "UQ_5ad8983ccbcab375efd32e70da8"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "g_input_measurement" DROP CONSTRAINT "UQ_f6bc7cda7c1fc36952ec808f92d"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "discharge" DROP CONSTRAINT "UQ_ac423b39b01f9f8ffe63d85b30e"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(POINT,4326)`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(POINT,4326)`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "plot_file"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "rain" ADD CONSTRAINT "UQ_c0592b053d8bb9c3eb8220a17e4" UNIQUE ("dateTime", "date", "bathingspotId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "global_irradiance" ADD CONSTRAINT "UQ_06ff7473dccb21f7e603331f679" UNIQUE ("dateTime", "date", "bathingspotId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "g_input_measurement" ADD CONSTRAINT "UQ_bbdec007356671e7d1d069e6e28" UNIQUE ("dateTime", "date", "genericInputId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "discharge" ADD CONSTRAINT "UQ_d34d200330ccfdb0e3f6b496b7f" UNIQUE ("dateTime", "date", "bathingspotId")`,
      undefined,
    );
  }
}
