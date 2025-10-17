import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProductEntityCascade1760733417385
  implements MigrationInterface
{
  name = 'FixProductEntityCascade1760733417385';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_order" DROP CONSTRAINT "FK_717057f3f11a007030181422152"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_order" ADD CONSTRAINT "FK_717057f3f11a007030181422152" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_order" DROP CONSTRAINT "FK_717057f3f11a007030181422152"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_order" ADD CONSTRAINT "FK_717057f3f11a007030181422152" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
