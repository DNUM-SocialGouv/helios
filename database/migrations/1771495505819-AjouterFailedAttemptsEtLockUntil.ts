import { MigrationInterface, QueryRunner } from "typeorm";

export class AjouterFailedAttemptsEtLockUntil1771495505819 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE utilisateur
            ADD COLUMN failed_attempts INT DEFAULT 0,
            ADD COLUMN lock_until timestamp NULL;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE utilisateur
        DROP COLUMN failed_attempts,
        DROP COLUMN lock_until;`);
  }

}
