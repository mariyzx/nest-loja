import { MigrationInterface, QueryRunner } from "typeorm";

export class FixProductImagesIdGeneration1760806008957 implements MigrationInterface {
    name = 'FixProductImagesIdGeneration1760806008957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "id" DROP DEFAULT`);
    }

}
