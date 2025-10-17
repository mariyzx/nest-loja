import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderAndProductsRelation1760713654033 implements MigrationInterface {
    name = 'AddOrderAndProductsRelation1760713654033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "sell_value" integer NOT NULL, "productId" uuid, CONSTRAINT "PK_9849f0d8ce095e50e752616f691" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_order" ADD CONSTRAINT "FK_717057f3f11a007030181422152" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_order" DROP CONSTRAINT "FK_717057f3f11a007030181422152"`);
        await queryRunner.query(`DROP TABLE "product_order"`);
    }

}
