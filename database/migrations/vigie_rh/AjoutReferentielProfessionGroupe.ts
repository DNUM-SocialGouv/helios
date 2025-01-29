import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutReferentielProfessionGroupe implements MigrationInterface{

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE vigie_rh_ref_profession_groupe (
            id int NOT NULL,
            label varchar(255),
    
            PRIMARY KEY (id)
          );
        `);
      }
    
      async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS vigie_rh_ref_profession_groupe;");
      }

}