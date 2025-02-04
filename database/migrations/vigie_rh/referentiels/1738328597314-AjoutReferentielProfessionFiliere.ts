import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutReferentielProfessionFiliere1738328597314 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE vigierh_ref_profession_filiere (
            code int NOT NULL,
            label varchar(255),
            dt_creation DATE NOT NULL DEFAULT CURRENT_DATE,
    
            PRIMARY KEY (code)
          );
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS vigierh_ref_profession_filiere;");
  }

}