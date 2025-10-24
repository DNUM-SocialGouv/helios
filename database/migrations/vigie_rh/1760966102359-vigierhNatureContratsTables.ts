import { MigrationInterface, QueryRunner } from "typeorm";

export class VigierhNatureContratsTables1760966102359 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE vigierh_referentiel_nature_contrat (
            nature_contrat_code int NOT NULL,
            nature_contrat varchar(255),
            PRIMARY KEY (nature_contrat_code)
          );

        CREATE TABLE vigierh_nature_contrats_annuel (
            numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
            annee INT NOT NULL, 
            nature_contrat_code INT NOT NULL,
            effectif INT,
            effectif_ref INT,

            PRIMARY KEY (numero_finess_etablissement_territorial, annee, nature_contrat_code),
            CONSTRAINT vigierh_nature_contrats_etablissement_territorial_finess_foreign_key
            FOREIGN KEY (numero_finess_etablissement_territorial)
              REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
              ON DELETE CASCADE,
            CONSTRAINT nature_contrat_foreign_key
            FOREIGN KEY (nature_contrat_code)
                REFERENCES vigierh_referentiel_nature_contrat (nature_contrat_code)
                ON DELETE CASCADE
          );

        CREATE TABLE vigierh_nature_contrats_trimestriel (
            numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
            annee INT NOT NULL, 
            trimestre INT NOT NULL,
            nature_contrat_code INT NOT NULL,
            effectif INT,
            effectif_ref INT,

            PRIMARY KEY (numero_finess_etablissement_territorial, annee, trimestre, nature_contrat_code),
            CONSTRAINT vigierh_nature_contrats_trimestriel_etablissement_territorial_finess_foreign_key
            FOREIGN KEY (numero_finess_etablissement_territorial)
              REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
              ON DELETE CASCADE,
            CONSTRAINT nature_contrat_trimestriel_foreign_key
            FOREIGN KEY (nature_contrat_code)
                REFERENCES vigierh_referentiel_nature_contrat (nature_contrat_code)
                ON DELETE CASCADE
          );

        ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_nature_contrat'; 
        ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_nature_contrats_annuel';
        ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_nature_contrats_trimestriel';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS vigierh_referentiel_nature_contrat;
      DROP TABLE IF EXISTS vigierh_nature_contrats_annuel;
      DROP TABLE IF EXISTS vigierh_nature_contrats_trimestriel;
      `);

  }

}
