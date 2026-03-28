import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingMeetingFields1774901000000 implements MigrationInterface {
  name = 'AddBookingMeetingFields1774901000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "meetingProvider" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "meetingLink" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "meetingLink"`);
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "meetingProvider"`);
  }
}
