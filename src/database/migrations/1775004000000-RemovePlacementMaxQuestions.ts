import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePlacementMaxQuestions1775004000000 implements MigrationInterface {
  name = 'RemovePlacementMaxQuestions1775004000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "placement" DROP COLUMN IF EXISTS "maxQuestions"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "placement" ADD COLUMN "maxQuestions" integer`,
    );
  }
}
