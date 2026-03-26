import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutColonnesAutorisationsAmmStatutEtLibelles1774365753368 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE autorisation_sanitaire_amm
      ADD COLUMN IF NOT EXISTS lib_activite TEXT,
      ADD COLUMN IF NOT EXISTS lib_modalite TEXT,
      ADD COLUMN IF NOT EXISTS lib_mention TEXT,
      ADD COLUMN IF NOT EXISTS lib_pts TEXT,
      ADD COLUMN IF NOT EXISTS lib_declaration TEXT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE autorisation_sanitaire_amm
      DROP COLUMN IF EXISTS lib_declaration,
      DROP COLUMN IF EXISTS lib_pts,
      DROP COLUMN IF EXISTS lib_mention,
      DROP COLUMN IF EXISTS lib_modalite,
      DROP COLUMN IF EXISTS lib_activite;
    `);
  }
}
