import { MigrationInterface, QueryRunner } from 'typeorm';

export class ElearningSchemaUpdate1774662423300 implements MigrationInterface {
  name = 'ElearningSchemaUpdate1774662423300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "course" ("price" integer, "level" character varying NOT NULL, "description" character varying, "title" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tutorId" integer NOT NULL, CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz" ("passingScore" integer, "description" character varying, "title" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "courseId" uuid NOT NULL, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("correctAnswer" character varying NOT NULL, "options" character varying NOT NULL, "prompt" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "student_answer" ("submittedAt" TIMESTAMP NOT NULL, "isCorrect" boolean NOT NULL, "answer" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid NOT NULL, "questionId" uuid NOT NULL, "studentId" integer NOT NULL, CONSTRAINT "PK_376adcf5739803c71c22eece43b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "enrollment" ("progress" integer, "status" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "courseId" uuid NOT NULL, "studentId" integer NOT NULL, CONSTRAINT "PK_7e200c699fa93865cdcdd025885" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("paidAt" TIMESTAMP, "providerReference" character varying, "status" character varying NOT NULL, "currency" character varying NOT NULL, "amount" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" integer NOT NULL, "enrollmentId" uuid NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lesson" ("lessonOrder" integer NOT NULL, "videoUrl" character varying, "content" character varying, "title" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "courseId" uuid NOT NULL, CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "review" ("targetType" character varying NOT NULL, "comment" character varying, "rating" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "reviewerId" integer NOT NULL, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("status" character varying NOT NULL, "startTime" character varying NOT NULL, "bookingDate" TIMESTAMP NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tutorId" integer NOT NULL, "studentId" integer NOT NULL, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "availability" ("endTime" character varying NOT NULL, "startTime" character varying NOT NULL, "dayOfWeek" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tutorId" integer NOT NULL, CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "englishLevel" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "learningGoals" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "certifications" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "spokenLanguages" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "hourlyRate" integer`);
    await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying`);
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_d0bf2b28f974f68f2b9e3e97274" FOREIGN KEY ("tutorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD CONSTRAINT "FK_f74ae73a766eea8e0dfb09816ba" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_answer" ADD CONSTRAINT "FK_60e3a3f0875fdf970ffb5e5f65e" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_answer" ADD CONSTRAINT "FK_d1b9efd6286e9c05ed43cf28ae4" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_answer" ADD CONSTRAINT "FK_4827af87118435ca77775e8c22f" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_d1a599a7740b4f4bd1120850f04" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_5ce702e71b98cc1bb37b81e83d8" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_f2af0d65275b237384bb70a468d" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_7dabb0332ddcf46da791fc60dcb" FOREIGN KEY ("enrollmentId") REFERENCES "enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_3801ccf9533a8627c1dcb1e33bf" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_34413365b39e3bf5bea866569b4" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_d1ed62530424578d6629764ce7a" FOREIGN KEY ("tutorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_16524af86c0e3b3dd66517eec6a" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_a2dbcbd86709186ad2a92fd63ae" FOREIGN KEY ("tutorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_a2dbcbd86709186ad2a92fd63ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_16524af86c0e3b3dd66517eec6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_d1ed62530424578d6629764ce7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_34413365b39e3bf5bea866569b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_3801ccf9533a8627c1dcb1e33bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_7dabb0332ddcf46da791fc60dcb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_f2af0d65275b237384bb70a468d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_5ce702e71b98cc1bb37b81e83d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_d1a599a7740b4f4bd1120850f04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_answer" DROP CONSTRAINT "FK_4827af87118435ca77775e8c22f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_answer" DROP CONSTRAINT "FK_d1b9efd6286e9c05ed43cf28ae4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_answer" DROP CONSTRAINT "FK_60e3a3f0875fdf970ffb5e5f65e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz" DROP CONSTRAINT "FK_f74ae73a766eea8e0dfb09816ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_d0bf2b28f974f68f2b9e3e97274"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hourlyRate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "spokenLanguages"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "certifications"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "learningGoals"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "englishLevel"`);
    await queryRunner.query(`DROP TABLE "availability"`);
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(`DROP TABLE "lesson"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "enrollment"`);
    await queryRunner.query(`DROP TABLE "student_answer"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TABLE "quiz"`);
    await queryRunner.query(`DROP TABLE "course"`);
  }
}
