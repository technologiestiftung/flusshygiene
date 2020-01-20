import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApiEndpointsType1579526328123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table bathingspot alter column "apiEndpoints" SET DATA TYPE text;`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table bathingspot alter column "apiEndpoints" SET DATA TYPE json;`,
      undefined,
    );
  }
}
