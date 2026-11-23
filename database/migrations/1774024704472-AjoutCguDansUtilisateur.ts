import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutCguDansUtilisateur1774024704472 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE utilisateur
        ADD COLUMN ut_cgu BOOLEAN NOT NULL DEFAULT false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE utilisateur
        DROP COLUMN ut_cgu;
    `);
  }
}
