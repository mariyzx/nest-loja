import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFloatValueOnProductOrder1760736878869
  implements MigrationInterface
{
  name = 'AddFloatValueOnProductOrder1760736878869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_order" DROP COLUMN "sell_value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_order" ADD "sell_value" double precision NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_order" DROP COLUMN "sell_value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_order" ADD "sell_value" integer NOT NULL`,
    );
  }
}
