import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutActivitéMédicoSocial1656002701263 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE activite_medico_social (
        annee INT NOT NULL,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
        taux_occupation_accueil_de_jour FLOAT,
        taux_occupation_en_hebergement_temporaire FLOAT,
        taux_occupation_en_hebergement_permanent FLOAT,
        taux_realisation_activite FLOAT,
        file_active_personnes_accompagnees FLOAT,
        nombre_moyen_journees_absence_personnes_accompagnees FLOAT,
        duree_moyenne_sejour_accompagnement_personnes_sorties FLOAT,

        PRIMARY KEY (annee, numero_finess_etablissement_territorial),

        CONSTRAINT activite_medico_social_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE activite_medico_social");
  }
}
