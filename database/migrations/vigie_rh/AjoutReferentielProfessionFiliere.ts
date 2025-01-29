import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutReferentielProfessionFiliere implements MigrationInterface{

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE vigie_rh_ref_profession_filiere (
            id int NOT NULL,
            label varchar(255),
    
            PRIMARY KEY (id)
          );
        `);
      }
    
      async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS vigie_rh_ref_profession_filiere;");
      }

}