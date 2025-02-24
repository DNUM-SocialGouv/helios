import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutVigieRhContrat1738320902145 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE vigierh_contrat (
          numero_finess VARCHAR(9) NOT NULL,
          annee INT NOT NULL,
          mois INT NOT NULL,
          type_contrat_code INT NOT NULL,
          effectif INT,
          dt_creation DATE NOT NULL DEFAULT CURRENT_DATE,
          PRIMARY KEY (numero_finess, annee, mois, type_contrat_code),
          CONSTRAINT fk_contrat_type_contrat FOREIGN KEY (type_contrat_code) 
          REFERENCES vigierh_ref_type_contrat(code)
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS vigierh_contrat;
    `);
  }
}
