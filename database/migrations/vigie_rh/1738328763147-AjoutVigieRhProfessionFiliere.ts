import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutVigieRhProfessionFiliere1738328763147 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Création de la table
    await queryRunner.query(`
      CREATE TABLE vigierh_profession_filiere (
          numero_finess VARCHAR(9) NOT NULL,
          annee INT NOT NULL,
          mois INT NOT NULL,
          quarter INT NOT NULL,
          profession_code INT NOT NULL,
          effectif_filiere INT,
          effectif_etab INT, 
          PRIMARY KEY (numero_finess, annee, mois, profession_code),
          CONSTRAINT fk_profession_filiere_profession FOREIGN KEY (profession_code) 
          REFERENCES vigierh_ref_profession_filiere(code)
      );
    `);

    // TODO :  Ajout de l'index éventuellement   
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS vigierh_profession_filiere;
    `);
  }
}
