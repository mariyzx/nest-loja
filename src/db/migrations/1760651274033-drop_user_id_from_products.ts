import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUserIdFromProducts1760651274033 implements MigrationInterface {
  name = 'DropUserIdFromProducts1760651274033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "user_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "user_id" character varying NOT NULL`,
    );
  }
}
