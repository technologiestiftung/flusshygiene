import { MigrationInterface, QueryRunner } from 'typeorm';

export class RModelBinary1565098393765 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(
    //   `ALTER TABLE "bathingspot_model" ADD COLUMN "rmodelBinary" bytea`,
    // );
  }

  public async down(_queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(
    //   `ALTER TABLE "bathingspot_model" DROP COLUMN "rmodelBinary"`,
    // );
  }
}
