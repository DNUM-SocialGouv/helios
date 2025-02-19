import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutReferentielTrancheAge1739874041081 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_tranche_age';

          CREATE TABLE vigierh_referentiel_tranche_age (
            code_tranche_age int NOT NULL,
            tranche_age varchar(255),
            creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
            PRIMARY KEY (code_tranche_age)
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS vigierh_referentiel_tranche_age;");
  }

}
