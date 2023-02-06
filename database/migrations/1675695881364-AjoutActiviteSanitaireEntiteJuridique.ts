import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutActiviteSanitaireEntiteJuridique1675695881364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE activite_sanitaire_entite_juridique (
        annee INT NOT NULL,
        numero_finess_entite_juridique VARCHAR(9) NOT NULL,
        nombre_sejours_partiels_medecine FLOAT,
        nombre_sejours_partiels_obstetrique FLOAT,
        nombre_sejours_partiels_chirurgie FLOAT,
        nombre_sejours_completes_medecine FLOAT,
        nombre_sejours_completes_ostetrique FLOAT,
        nombre_sejours_completes_chirurgie FLOAT,
        nombre_journees_completes_ssr FLOAT,
        nombre_journees_partiels_ssr FLOAT, 
        nombre_journees_completes_psy FLOAT,
        nombre_journees_partiels_psy FLOAT,
        nombre_passages_urgences FLOAT,

        PRIMARY KEY (annee, numero_finess_entite_juridique),

        CONSTRAINT activite_sanitaire_entite_juridique_foreign_key 
         FOREIGN KEY (numero_finess_entite_juridique)
         REFERENCES entite_juridique(numero_finess_entite_juridique)
         ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE activite_sanitaire_entite_juridique;");
  }
}
