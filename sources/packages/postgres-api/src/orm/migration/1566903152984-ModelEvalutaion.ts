import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModelEvalutaion1566903152984 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "bathingspot_model" ADD COLUMN IF NOT EXISTS "evaluation" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "bathingspot_model" DROP COLUMN "evaluation"`,
    );
  }
}
