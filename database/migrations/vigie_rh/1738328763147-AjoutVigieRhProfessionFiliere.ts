import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutVigieRhProfessionFiliere1738328763147 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Création de la table
    await queryRunner.query(`
      CREATE TABLE vigierh_profession_filiere (
        numero_finess VARCHAR(9) NOT NULL,
        annee INT NOT NULL,
        mois INT NOT NULL,
        profession_code int NOT NULL,
        turnover FLOAT,
        taux_entrees FLOAT,
        taux_sorties FLOAT,
        nombre_entrees INT,
        nombre_sorties INT,
        region_turnover FLOAT,
        nation_turnover FLOAT,
        groupe_turnover FLOAT,
        dt_creation DATE NOT NULL DEFAULT CURRENT_DATE,

        PRIMARY KEY (numero_finess, annee, mois, profession_code)
      );

      ALTER TABLE vigierh_profession_filiere
      ADD CONSTRAINT fk_profession_filiere_profession
      FOREIGN KEY (profession_code)
      REFERENCES vigierh_ref_profession_filiere(code);
    `);

    // TODO :  Ajout de l'index éventuellement   
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE vigierh_profession_filiere
      DROP CONSTRAINT fk_profession_filiere_profession;

      DROP TABLE IF EXISTS vigierh_profession_filiere;
    `);
  }
}
