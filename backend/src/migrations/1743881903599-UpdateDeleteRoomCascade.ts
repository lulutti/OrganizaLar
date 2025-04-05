import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDeleteRoomCascade1743881903599 implements MigrationInterface {
    name = 'UpdateDeleteRoomCascade1743881903599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_e85e8653435631a7acad96e9ebf"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_e85e8653435631a7acad96e9ebf" FOREIGN KEY ("id_room") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_e85e8653435631a7acad96e9ebf"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_e85e8653435631a7acad96e9ebf" FOREIGN KEY ("id_room") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
