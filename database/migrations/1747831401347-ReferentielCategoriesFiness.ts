import { MigrationInterface, QueryRunner } from "typeorm";

export class ReferentielCategoriesFiness1747831401347 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE referentiel_categories (
            code VARCHAR(3) NOT NULL,
            libelle VARCHAR(255) NOT NULL,
            libelle_court VARCHAR(100) NOT NULL,
 
            CONSTRAINT referentiel_categories_primary_key PRIMARY KEY (code)
          );
          `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE referentiel_categories");
  }

}
