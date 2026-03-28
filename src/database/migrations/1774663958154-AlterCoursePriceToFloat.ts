import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCoursePriceToFloat1774663958154 implements MigrationInterface {
  name = 'AlterCoursePriceToFloat1774663958154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course" ALTER COLUMN "price" TYPE double precision USING "price"::double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course" ALTER COLUMN "price" TYPE integer USING "price"::integer`,
    );
  }
}
