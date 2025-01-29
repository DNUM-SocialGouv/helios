import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutVigieRhContrat implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE vigie_rh_contrat (
        numero_finess VARCHAR(9) NOT NULL,
        annee INT NOT NULL,
        mois INT NOT NULL,
        type_contrat int NOT NULL,
        effectif INT,

        PRIMARY KEY (numero_finess, annee, mois)
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS vigie_rh_contrat;");
  }
}
