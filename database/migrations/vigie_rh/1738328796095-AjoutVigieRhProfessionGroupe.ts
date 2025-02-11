import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutVigieRhProfessionGroupe1738328796095 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Création de la table vigie_rh_profession_groupe
    await queryRunner.query(`
      CREATE TABLE vigierh_profession_groupe (
        numero_finess VARCHAR(9) NOT NULL,
        annee INT NOT NULL,
        mois INT NOT NULL,
        profession_code int NOT NULL,
        effectif INT, 
        indic_qualite_effectif_code int,
        indic_redressement_effectif_code int,
        indic_masque_secret_effectif_code int,
        dt_creation DATE NOT NULL DEFAULT CURRENT_DATE,

        PRIMARY KEY (numero_finess, annee, mois, profession_code)
      );
    `);

    // TODO :  Ajout de l'index éventuellement
  
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS vigierh_profession_groupe;");
  }
}
