import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutAutorisationsDesETSanitaires1661442115103 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE autorisation_sanitaire (
        code_activite VARCHAR(2) NOT NULL,
        code_forme VARCHAR(2) NOT NULL,
        code_modalite VARCHAR(2) NOT NULL,
        date_autorisation DATE,
        date_fin DATE,
        date_mise_en_oeuvre DATE,
        libelle_activite VARCHAR(255) NOT NULL,
        libelle_forme VARCHAR(255) NOT NULL,
        libelle_modalite VARCHAR(255) NOT NULL,
        numero_autorisation_arhgos VARCHAR(31) PRIMARY KEY,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,

        CONSTRAINT autorisation_sanitaire_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );

      CREATE TABLE equipement_materiel_lourd (
        code_equipement_materiel_lourd VARCHAR(5) NOT NULL,
        date_autorisation DATE,
        date_fin DATE,
        date_mise_en_oeuvre DATE,
        libelle_equipement_materiel_lourd VARCHAR(255) NOT NULL,
        numero_autorisation_arhgos VARCHAR(31) PRIMARY KEY,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,

        CONSTRAINT equipement_materiel_lourd_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );

      CREATE TABLE autre_activite_sanitaire (
        code_activite VARCHAR(2) NOT NULL,
        code_forme VARCHAR(2) NOT NULL,
        code_modalite VARCHAR(2) NOT NULL,
        date_autorisation DATE,
        date_fin DATE,
        date_mise_en_oeuvre DATE,
        libelle_activite VARCHAR(255) NOT NULL,
        libelle_forme VARCHAR(255) NOT NULL,
        libelle_modalite VARCHAR(255) NOT NULL,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,

        PRIMARY KEY (numero_finess_etablissement_territorial, code_activite, code_forme, code_modalite),

        CONSTRAINT autre_activite_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );

      CREATE TABLE reconnaissance_contractuelle_sanitaire (
        capacite_autorisee INTEGER,
        code_activite VARCHAR(2) NOT NULL,
        code_forme VARCHAR(2) NOT NULL,
        code_modalite VARCHAR(2) NOT NULL,
        date_effet_asr DATE,
        date_effet_cpom DATE,
        date_fin_cpom DATE,
        id_cpom VARCHAR(12) NOT NULL,
        libelle_activite VARCHAR(255) NOT NULL,
        libelle_forme VARCHAR(255) NOT NULL,
        libelle_modalite VARCHAR(255) NOT NULL,
        numero_autorisation_arhgos VARCHAR(31) PRIMARY KEY,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,

        CONSTRAINT reconnaissance_contractuelle_sanitaire_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'finess_cs1400103';

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'finess_cs1400104';

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'finess_cs1600101';

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'finess_cs1600102';
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE autorisation_sanitaire;
        DROP TABLE equipement_materiel_lourd;
        DROP TABLE autre_activite_sanitaire;
        DROP TABLE reconnaissance_contractuelle_sanitaire;
    `);
  }
}
