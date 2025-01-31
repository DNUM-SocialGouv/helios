import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutReferentielTypeContrat1738227384991 implements MigrationInterface{

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE vigie_rh_ref_type_contrat (
            id int NOT NULL,
            label varchar(255),
            dt_creation DATE NOT NULL DEFAULT CURRENT_DATE,
    
            PRIMARY KEY (id)
          );
        `);
      }
    
      async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS vigie_rh_ref_type_contrat;");
      }

}