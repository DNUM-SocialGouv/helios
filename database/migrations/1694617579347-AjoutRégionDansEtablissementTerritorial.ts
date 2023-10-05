import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutRégionDansEtablissementTerritorial1694617579347 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE etablissement_territorial
        ADD code_region VARCHAR(255) NOT NULL DEFAULT ('')`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE etablissement_territorial;");
    }

}
