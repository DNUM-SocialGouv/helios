import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutReferentielProfessionGroupe1738328713502 implements MigrationInterface{

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE vigierh_ref_profession_groupe (
            code int NOT NULL,
            label varchar(255),
            dt_creation DATE NOT NULL DEFAULT CURRENT_DATE,
    
            PRIMARY KEY (code)
          );
        `);
      }
    
      async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS vigierh_ref_profession_groupe;");
      }

}