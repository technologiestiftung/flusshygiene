import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ginputmeasurement1576773244225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table g_input_measurement alter column "dateTime" drop not null;`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table g_input_measurement alter column "dateTime" drop set not null;`,
      undefined,
    );
  }
}
