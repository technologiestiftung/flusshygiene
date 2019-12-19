import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpotMeasurements1576773972547 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table discharge alter column "dateTime" drop not null;`,
      undefined,
    );
    await queryRunner.query(
      `alter table rain  alter column "dateTime" drop not null;`,
      undefined,
    );
    await queryRunner.query(
      `alter table discharge alter column "dateTime" drop not null;`,
      undefined,
    );
    await queryRunner.query(
      `alter table global_irradiance alter column "dateTime" drop not null;`,
      undefined,
    );
    // await queryRunner.query(
    //   `alter table bathingspot_measurement alter column "dateTime" drop not null;`,
    //   undefined,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table discharge alter column "dateTime" drop set not null;`,
      undefined,
    );
    await queryRunner.query(
      `alter table rain alter column "dateTime" drop set not null;`,
      undefined,
    );
    await queryRunner.query(
      `alter table discharge alter column "dateTime" drop set not null;`,
      undefined,
    );
    await queryRunner.query(
      `alter table global_irradiance alter column "dateTime" drop set not null;`,
      undefined,
    );
    // await queryRunner.query(
    //   `alter table bathingspot_measurement alter column "dateTime" drop set not null;`,
    //   undefined,
    // );
  }
}
