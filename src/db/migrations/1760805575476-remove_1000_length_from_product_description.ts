import { MigrationInterface, QueryRunner } from "typeorm";

export class Remove1000LengthFromProductDescription1760805575476 implements MigrationInterface {
    name = 'Remove1000LengthFromProductDescription1760805575476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total_value" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."order_status" AS ENUM('PENDING', 'COMPLETED', 'CANCELED')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "status" "public"."order_status" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."order_status"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total_value" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "description" character varying(1000) NOT NULL`);
    }

}
