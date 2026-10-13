import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutCodePostalDansLesEtablissements1791893026128 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE entite_juridique
            ADD COLUMN code_postal VARCHAR(5) NOT NULL DEFAULT '';
        `);

        await queryRunner.query(`
            ALTER TABLE etablissement_territorial
            ADD COLUMN code_postal VARCHAR(5) NOT NULL DEFAULT '';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE entite_juridique
            DROP COLUMN code_postal;
        `);

        await queryRunner.query(`
            ALTER TABLE etablissement_territorial
            DROP COLUMN code_postal;
        `);
    }

}
