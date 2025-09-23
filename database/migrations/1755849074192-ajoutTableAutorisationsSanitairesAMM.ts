import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTableAutorisationsSanitairesAMM1755849074192 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE autorisation_sanitaire_amm (
        code_activite VARCHAR(5) NOT NULL,
        code_modalite VARCHAR(5) NOT NULL,
        code_mention VARCHAR(5) NOT NULL,
        code_pratique VARCHAR(5) NOT NULL,
        code_declaration VARCHAR(5) NOT NULL,
        date_autorisation DATE,
        date_fin DATE,
        date_mise_en_oeuvre DATE,

        code_autorisation_arhgos VARCHAR(31) PRIMARY KEY,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,

        CONSTRAINT autorisation_sanitaire_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );


        ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'amm_arhgos';
         `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE autorisation_sanitaire_amm;
    `);
  }

}
