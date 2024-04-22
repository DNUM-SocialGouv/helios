import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutTableInspectionsControles1712743083892 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'siicea';

        CREATE TABLE inspections_controles_etablissement_territorial (
          inspection_id bigserial NOT NULL,
          numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
          type_mission VARCHAR(255), 
          theme_regional VARCHAR(255), 
          type_plannification VARCHAR(255),
          modalite_mission VARCHAR(255),
          statut_mission VARCHAR(255),
          date_visite DATE,
          date_rapport DATE,
          nombre_ecart INTEGER,
          nombre_remarque INTEGER,
          injonction INTEGER,
          prescription INTEGER,
          recommandation INTEGER,
          saisine_cng INTEGER,
          saisine_juridiction INTEGER,
          saisine_parquet INTEGER,
          saisine_autre INTEGER,

          PRIMARY KEY (inspection_id),

          CONSTRAINT inspection_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
          REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
          ON DELETE CASCADE
          )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP TABLE inspections_controles_etablissement_territorial;
        `);
    }

}
