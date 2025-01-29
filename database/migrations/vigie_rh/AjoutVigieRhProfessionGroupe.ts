import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutVigieRhProfessionGroupe implements MigrationInterface {
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

        PRIMARY KEY (numero_finess, annee, mois)
      );
    `);

    // Ajout de l'index sur la colonne "profession"
    await queryRunner.query(`
      CREATE INDEX idx_profession ON vigie_rh_profession_groupe (profession);
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Suppression de l'index et de la table en cas de rollback
    await queryRunner.query("DROP INDEX IF EXISTS idx_profession;");
    await queryRunner.query("DROP TABLE IF EXISTS vigie_rh_profession_groupe;");
  }
}
