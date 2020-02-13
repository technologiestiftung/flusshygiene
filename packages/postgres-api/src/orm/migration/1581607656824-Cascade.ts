import {MigrationInterface, QueryRunner} from "typeorm";

export class Cascade1581607656824 implements MigrationInterface {
    name = 'Cascade1581607656824'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generic_input" DROP CONSTRAINT "FK_757839932b45f5d6094e3de8101"`, undefined);
        await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`, undefined);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(Polygon,4326)`, undefined);
        await queryRunner.query(`ALTER TABLE "generic_input" ADD CONSTRAINT "FK_757839932b45f5d6094e3de8101" FOREIGN KEY ("bathingspotId") REFERENCES "bathingspot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generic_input" DROP CONSTRAINT "FK_757839932b45f5d6094e3de8101"`, undefined);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "area" TYPE geometry(POINT,4326)`, undefined);
        await queryRunner.query(`ALTER TABLE "bathingspot" ALTER COLUMN "area" TYPE geometry(POINT,4326)`, undefined);
        await queryRunner.query(`ALTER TABLE "generic_input" ADD CONSTRAINT "FK_757839932b45f5d6094e3de8101" FOREIGN KEY ("bathingspotId") REFERENCES "bathingspot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
