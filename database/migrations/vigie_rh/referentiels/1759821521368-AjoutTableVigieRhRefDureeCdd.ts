import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTableVigieRhRefDureeCdd1759821521368 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_duree_cdd';

          CREATE TABLE vigierh_referentiel_duree_cdd (
            duree_code int NOT NULL,
            duree varchar(255),
            PRIMARY KEY (duree_code)
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS vigierh_referentiel_duree_cdd;`);
  }

}
