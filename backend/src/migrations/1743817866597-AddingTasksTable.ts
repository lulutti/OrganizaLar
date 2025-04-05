import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingTasksTable1743817866597 implements MigrationInterface {
  name = 'AddingTasksTable1743817866597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "last_time_done" TIMESTAMP, "planned" boolean NOT NULL DEFAULT false, "status" "public"."task_status_enum" NOT NULL DEFAULT 'pending', "id_user" uuid, "id_assigned" uuid, "id_room" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_05597b495e2aeb497af5f6b75d9" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_0c48d63e4c67233b3759a15643c" FOREIGN KEY ("id_assigned") REFERENCES "contributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_e85e8653435631a7acad96e9ebf" FOREIGN KEY ("id_room") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_e85e8653435631a7acad96e9ebf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_0c48d63e4c67233b3759a15643c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_05597b495e2aeb497af5f6b75d9"`,
    );
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
