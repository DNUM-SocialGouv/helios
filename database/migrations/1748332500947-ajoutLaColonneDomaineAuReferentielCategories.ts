import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutLaColonneDomaineAuReferentielCategories1748332500947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE referentiel_categories ADD COLUMN domaine VARCHAR(20);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE referentiel_categories DROP COLUMN domaine;`);
    }

}
