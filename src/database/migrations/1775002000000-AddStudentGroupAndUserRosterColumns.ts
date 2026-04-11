import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates `student_group` and adds roster/payment columns on `user` that the
 * app entities expect (admin student hub). Safe to run after legacy e-learning migrations.
 */
export class AddStudentGroupAndUserRosterColumns1775002000000 implements MigrationInterface {
  name = 'AddStudentGroupAndUserRosterColumns1775002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "link" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a8c0a5f4b8c04f1e9c2d3b4a5f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "groupId" uuid`);
    await queryRunner.query(`ALTER TABLE "user" ADD "adminNotes" text`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "nextPaymentDate" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "nextPaymentAmount" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_user_student_group_groupId" FOREIGN KEY ("groupId") REFERENCES "student_group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_user_student_group_groupId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "nextPaymentAmount"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nextPaymentDate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "adminNotes"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "groupId"`);
    await queryRunner.query(`DROP TABLE "student_group"`);
  }
}
