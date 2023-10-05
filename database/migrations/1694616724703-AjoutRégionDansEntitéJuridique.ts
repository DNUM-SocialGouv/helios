import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutRégionDansEntitéJuridique1694616724703 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE entite_juridique
        ADD code_region VARCHAR(255) NOT NULL DEFAULT ('')`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE entite_juridique;");
    }

}
