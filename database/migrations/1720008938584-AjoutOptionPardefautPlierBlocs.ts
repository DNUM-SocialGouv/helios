import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutOptionPardefautPlierBlocs1720008938584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE utilisateur
            ADD plier_blocs BOOLEAN NOT NULL DEFAULT FALSE;
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE utilisateur
        DROP COLUMN plier_blocs;
        `);
  }
}
