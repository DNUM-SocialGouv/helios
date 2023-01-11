import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutFichierSourceAnnErrdEj1664462123042 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE budget_et_finances_medico_social
        ADD COLUMN fonds_de_roulement float;

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'ann_errd_ej';
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE budget_et_finances_medico_social
        DROP COLUMN fonds_de_roulement;
    `);
  }
}
