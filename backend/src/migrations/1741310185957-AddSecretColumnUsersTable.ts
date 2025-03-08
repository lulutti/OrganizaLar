import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSecretColumnUsersTable1741310185957 implements MigrationInterface {
    name = 'AddSecretColumnUsersTable1741310185957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "secretQuestion" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "secretAnswer" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "secretAnswer"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "secretQuestion"`);
    }

}
