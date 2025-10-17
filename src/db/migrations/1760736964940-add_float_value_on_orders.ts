import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFloatValueOnOrders1760736964940 implements MigrationInterface {
  name = 'AddFloatValueOnOrders1760736964940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_value"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "total_value" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_value"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "total_value" integer`);
  }
}
