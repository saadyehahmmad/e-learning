import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Reconciles **legacy** databases that were created with older migrations that
 * still had `provider`, `socialId`, and tutor/profile columns on `user`.
 *
 * Fresh installs use updated `CreateUser` / `ElearningSchemaUpdate` and never
 * create these columns; this migration is then a no-op aside from harmless
 * `IF EXISTS` / `DROP INDEX IF EXISTS` statements.
 */
export class RemoveUserProfileAndProviderColumns1775001000000 implements MigrationInterface {
  name = 'RemoveUserProfileAndProviderColumns1775001000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "englishLevel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "learningGoals"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "certifications"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "spokenLanguages"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "hourlyRate"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "bio"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "provider"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "socialId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "provider" character varying NOT NULL DEFAULT 'email'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "socialId" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
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
  }
}
