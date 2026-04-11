import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Replaces legacy e-learning `student_answer` / `payment` (quiz + enrollment FKs)
 * with the current schema: `placement`, answers keyed by placement + questionId,
 * and payments keyed only by student. Drops existing data in those tables.
 *
 * `down()` only drops the new tables; it does not restore the old quiz-linked schema.
 */
export class PlacementAndStudentAnswerPaymentSchema1775003000000 implements MigrationInterface {
  name = 'PlacementAndStudentAnswerPaymentSchema1775003000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "student_answer" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payment" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "placement" CASCADE`);

    await queryRunner.query(
      `CREATE TABLE "placement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questions" jsonb NOT NULL DEFAULT '[]'::jsonb, "passingScore" integer, "description" character varying, "title" character varying NOT NULL, "examDurationMinutes" integer, "maxQuestions" integer, "quizDescription" text, "courseTitle" character varying, "courseLevel" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_placement_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "student_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submittedAt" TIMESTAMP NOT NULL, "isCorrect" boolean NOT NULL, "answer" character varying NOT NULL, "questionId" uuid NOT NULL, "placementId" uuid NOT NULL, "studentId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_student_answer_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_answer" ADD CONSTRAINT "FK_student_answer_placement" FOREIGN KEY ("placementId") REFERENCES "placement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_answer" ADD CONSTRAINT "FK_student_answer_student" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paidAt" TIMESTAMP, "providerReference" character varying, "status" character varying NOT NULL, "currency" character varying NOT NULL, "amount" integer NOT NULL, "studentId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_payment_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_payment_student" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_answer" DROP CONSTRAINT IF EXISTS "FK_student_answer_student"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_answer" DROP CONSTRAINT IF EXISTS "FK_student_answer_placement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT IF EXISTS "FK_payment_student"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "student_answer"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payment"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "placement"`);
  }
}
