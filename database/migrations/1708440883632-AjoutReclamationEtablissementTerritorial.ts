import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutReclamationET1708440883632 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE reclamation_etablissement_territorial (
            annee INTEGER NOT NULL,
            numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
            encours_total INTEGER,
            encours_motif_10 INTEGER,
            encours_motif_11 INTEGER,
            encours_motif_12 INTEGER,
            encours_motif_13 INTEGER,
            encours_motif_14 INTEGER,
            encours_motif_15 INTEGER,
            encours_motif_16 INTEGER,
            encours_motif_17 INTEGER,
            encours_motif_18 INTEGER,
            encours_motif_19 INTEGER,
            encours_motif_155 INTEGER,
            encours_motif_156 INTEGER,
            clot_total INTEGER,
            clot_motif_10 INTEGER,
            clot_motif_11 INTEGER,
            clot_motif_12 INTEGER,
            clot_motif_13 INTEGER,
            clot_motif_14 INTEGER,
            clot_motif_15 INTEGER,
            clot_motif_16 INTEGER,
            clot_motif_17 INTEGER,
            clot_motif_18 INTEGER,
            clot_motif_19 INTEGER,
            clot_motif_155 INTEGER,
            clot_motif_156 INTEGER,
            
            PRIMARY KEY (annee, numero_finess_etablissement_territorial),

            CONSTRAINT reclamation_etablissement_territorial_finess_foreign_key
            FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
            )
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE reclamation");
  }

}
