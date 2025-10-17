import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderRelation1760733035981 implements MigrationInterface {
  name = 'AddOrderRelation1760733035981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product_order" ADD "orderId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "product_order" ADD CONSTRAINT "FK_42291ebe165058deecb017e652b" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_order" DROP CONSTRAINT "FK_42291ebe165058deecb017e652b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_order" DROP COLUMN "orderId"`,
    );
  }
}
