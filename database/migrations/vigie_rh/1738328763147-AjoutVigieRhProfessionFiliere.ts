import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutVigieRhProfessionFiliere1738328763147 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Création de la table
    await queryRunner.query(`
      CREATE TABLE vigie_rh_profession_filiere (
        numero_finess VARCHAR(9) NOT NULL,
        annee INT NOT NULL,
        mois INT NOT NULL,
        profession int NOT NULL,
        turnover FLOAT,
        entree_taux FLOAT,
        entree_sortie FLOAT,
        entrees INT,
        sorties INT,
        turnover_ref_region FLOAT,
        turnover_ref_nation FLOAT,
        turnover_ref_categorie FLOAT,
        dt_creation DATE NOT NULL DEFAULT CURRENT_DATE,

        PRIMARY KEY (numero_finess, annee, mois, profession)
      );
    `);

    // TODO :  Ajout de l'index éventuellement   
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Suppression de l'index et de la table en cas de rollback
    await queryRunner.query("DROP INDEX IF EXISTS idx_profession;");
    await queryRunner.query("DROP TABLE IF EXISTS vigie_rh_profession_filiere;");
  }
}
