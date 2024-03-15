import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutEvenementsIndesirables1710326854362 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TYPE etat_signal AS ENUM ('EN_COURS', 'CLOTURE');

        ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'sivss';

        CREATE TABLE evenement_indesirable_etablissement_territorial (
          evenement_indesirable_id bigserial NOT NULL,
          annee INTEGER NOT NULL,
          numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
          numero_sivss VARCHAR(6) NOT NULL, 
          famille_principale VARCHAR(255) NOT NULL, 
          nature_principale VARCHAR(255) NOT NULL,
          est_eigs BOOLEAN NOT NULL,
          etat etat_signal NOT NULL,
          date_cloture DATE,
          motif_cloture VARCHAR(255),

          PRIMARY KEY (evenement_indesirable_id),

          CONSTRAINT evenement_indesirable_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
          REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
          ON DELETE CASCADE
          )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP TABLE evenement_indesirable_etablissement_territorial;
        DROP TYPE etat_signal;
        `);

    }

}
