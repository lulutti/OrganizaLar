import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747689442115 implements MigrationInterface {
    name = 'InitialMigration1747689442115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cleaning_schedule_status_enum" AS ENUM('in_progress', 'cancelled', 'done')`);
        await queryRunner.query(`CREATE TABLE "cleaning_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "status" "public"."cleaning_schedule_status_enum" NOT NULL DEFAULT 'in_progress', "userId" uuid, CONSTRAINT "PK_ec4f9bc2224a13917c7ae059dc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."cleaning_schedule_task_status_enum" AS ENUM('pending', 'in_progress', 'done')`);
        await queryRunner.query(`CREATE TABLE "cleaning_schedule_task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."cleaning_schedule_task_status_enum" NOT NULL, "completedAt" TIMESTAMP WITH TIME ZONE, "assignedContributorId" uuid, "assignedUserId" uuid, "cleaningScheduleId" uuid, "taskId" uuid NOT NULL, CONSTRAINT "PK_fe5af2bf7e1d0522c25c65c57a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contributor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_816afef005b8100becacdeb6e58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "secretQuestion" character varying NOT NULL, "secretAnswer" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "isAdmin" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "last_time_done" TIMESTAMP, "userId" uuid, "roomId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule" ADD CONSTRAINT "FK_06e6d942221effa2c695c14f9cf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule_task" ADD CONSTRAINT "FK_28fe68506ee7e538dbfefdfc2af" FOREIGN KEY ("cleaningScheduleId") REFERENCES "cleaning_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule_task" ADD CONSTRAINT "FK_bed1f070bdea1c47dae9faae867" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule_task" ADD CONSTRAINT "FK_d12fba0faff1987253e04e3addd" FOREIGN KEY ("assignedContributorId") REFERENCES "contributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule_task" ADD CONSTRAINT "FK_3618fb49d1eac81ff986ab6dd5a" FOREIGN KEY ("assignedUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_0468c843ad48d3455e48d40ddd4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_204707cd615492e7280e24aea01" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_204707cd615492e7280e24aea01"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_0468c843ad48d3455e48d40ddd4"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330"`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule_task" DROP CONSTRAINT "FK_3618fb49d1eac81ff986ab6dd5a"`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule_task" DROP CONSTRAINT "FK_d12fba0faff1987253e04e3addd"`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule_task" DROP CONSTRAINT "FK_bed1f070bdea1c47dae9faae867"`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule_task" DROP CONSTRAINT "FK_28fe68506ee7e538dbfefdfc2af"`);
        await queryRunner.query(`ALTER TABLE "cleaning_schedule" DROP CONSTRAINT "FK_06e6d942221effa2c695c14f9cf"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "contributor"`);
        await queryRunner.query(`DROP TABLE "cleaning_schedule_task"`);
        await queryRunner.query(`DROP TYPE "public"."cleaning_schedule_task_status_enum"`);
        await queryRunner.query(`DROP TABLE "cleaning_schedule"`);
        await queryRunner.query(`DROP TYPE "public"."cleaning_schedule_status_enum"`);
    }

}
