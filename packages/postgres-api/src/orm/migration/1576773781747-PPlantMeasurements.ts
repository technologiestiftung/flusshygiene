import { MigrationInterface, QueryRunner } from 'typeorm';

export class PPlantMeasurements1576773781747 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table p_plant_measurement alter column "dateTime" drop not null;`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table p_plant_measurement alter column "dateTime" drop set not null;`,
      undefined,
    );
  }
}
