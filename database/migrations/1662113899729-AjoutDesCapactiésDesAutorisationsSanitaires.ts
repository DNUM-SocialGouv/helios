import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutDesCapactiésDesAutorisationsSanitaires1662113899729 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE capacite_autorisation_sanitaire (
        nombre_lits_chirurgie INTEGER,
        nombre_lits_médecine INTEGER,
        nombre_lits_obstétrique INTEGER,
        nombre_lits_ssr INTEGER,
        nombre_places_chirurgie INTEGER,
        nombre_places_médecine INTEGER,
        nombre_places_obstétrique INTEGER,
        nombre_places_ssr INTEGER,
        numero_finess_etablissement_territorial VARCHAR(9) PRIMARY KEY,

        CONSTRAINT capacite_autorisation_sanitaire_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'ann_sae';
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE capacite_autorisation_sanitaire;");
  }
}
