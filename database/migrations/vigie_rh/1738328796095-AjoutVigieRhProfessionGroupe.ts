import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutVigieRhProfessionGroupe1738328796095 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Création de la table vigie_rh_profession_groupe
    await queryRunner.query(`
      CREATE TABLE vigie_rh_profession_groupe (
        numero_finess VARCHAR(9) NOT NULL,
        annee INT NOT NULL,
        mois INT NOT NULL,
        profession int NOT NULL,
        effectif INT, 
        indic_qualite_effectif VARCHAR(2),
        indic_redressement_effectif VARCHAR(2),
        indic_masque_secret_effectif VARCHAR(2),
        dt_creation DATE NOT NULL DEFAULT CURRENT_DATE,

        PRIMARY KEY (numero_finess, annee, mois, profession)
      );
    `);

    // TODO :  Ajout de l'index éventuellement
  
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS vigie_rh_profession_groupe;");
  }
}
