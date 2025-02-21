import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutReferentielTrancheAge1739874041081 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_tranche_age';

          CREATE TABLE vigierh_referentiel_tranche_age (
            code_tranche_age int NOT NULL,
            tranche_age varchar(255),
            creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
            PRIMARY KEY (code_tranche_age)
          );

          ----- v2 : delete fk
          ALTER TABLE vigierh_profession_groupe
          DROP CONSTRAINT fk_profession_groupe_masque;
          
          ALTER TABLE vigierh_profession_groupe
          DROP CONSTRAINT fk_profession_groupe_redressement;
          
          ALTER TABLE vigierh_profession_groupe
          DROP CONSTRAINT fk_profession_groupe_qualite;

          ALTER TABLE vigierh_profession_groupe
          DROP COLUMN indic_redressement_effectif_code,
          DROP COLUMN indic_masque_secret_effectif_code,
          DROP COLUMN indic_qualite_effectif_code;

          ----- v3 : add fields
          ALTER TABLE vigierh_profession_groupe
          ADD COLUMN quarter INTEGER;
          
          ALTER TABLE vigierh_profession_groupe
          ADD COLUMN effectif_filiere INTEGER;

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS vigierh_referentiel_tranche_age;

        ----- v2
        ALTER TABLE vigierh_profession_groupe
        ADD CONSTRAINT fk_profession_groupe_masque
        FOREIGN KEY (indic_masque_secret_effectif_code)
        REFERENCES vigierh_ref_masque(code);

        ALTER TABLE vigierh_profession_groupe
        ADD CONSTRAINT fk_profession_groupe_redressement
        FOREIGN KEY (indic_redressement_effectif_code)
        REFERENCES vigierh_ref_redressement(code);

        ALTER TABLE vigierh_profession_groupe
        ADD CONSTRAINT fk_profession_groupe_qualite
        FOREIGN KEY (indic_qualite_effectif_code)
        REFERENCES vigierh_ref_qualite(code);
    
        ----- v3 
        ALTER TABLE vigierh_profession_groupe
        DROP COLUMN quarter;
        
        ALTER TABLE vigierh_profession_groupe
        DROP COLUMN effectif_filiere;

    `);
  }

}
