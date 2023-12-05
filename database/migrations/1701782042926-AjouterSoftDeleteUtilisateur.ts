import { MigrationInterface, QueryRunner } from "typeorm";

export class AjouterSoftDeleteUtilisateur1701782042926 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE utilisateur
        ADD ut_date_soft_delete timestamp,
        ADD ut_date_last_connection timestamp;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE utilisateur
    DROP COLUMN ut_date_soft_delete;
    DROP COLUMN ut_date_last_connection;
    `);
  }
}
