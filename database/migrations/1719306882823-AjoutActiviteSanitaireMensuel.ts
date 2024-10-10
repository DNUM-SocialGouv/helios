import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutActiviteSanitaireMensuel1719306882823 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE activite_sanitaire_mensuel (
        annee INT NOT NULL,
        mois INT NOT NULL,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,

        nombre_sejours_partiels_medecine FLOAT,
        nombre_sejours_partiels_obstetrique FLOAT,
        nombre_sejours_partiels_chirurgie FLOAT,
        nombre_sejours_complets_medecine FLOAT,
        nombre_sejours_complets_obstetrique FLOAT,
        nombre_sejours_complets_chirurgie FLOAT,
        nombre_journees_completes_ssr FLOAT,
        nombre_journees_partiels_ssr FLOAT, 

        PRIMARY KEY (annee, mois, numero_finess_etablissement_territorial),

        CONSTRAINT activite_sanitaire_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
          REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
          ON DELETE CASCADE
      );

      ALTER TYPE fichier_source
            ADD VALUE IF NOT EXISTS 'men_pmsi_mencumu';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE activite_sanitaire_mensuel;");
  }

}
