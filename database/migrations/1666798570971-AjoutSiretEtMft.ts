import { MigrationInterface, QueryRunner } from 'typeorm'

export class AjoutSiretEtMft1666798570971 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE etablissement_territorial
        ADD COLUMN siret VARCHAR(14) NOT NULL DEFAULT '',
        ADD COLUMN code_mode_tarification VARCHAR(2) NOT NULL DEFAULT '',
        ADD COLUMN libelle_du_mode_tarification VARCHAR(255) NOT NULL DEFAULT '';
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE etablissement_territorial
        DROP COLUMN siret,
        DROP COLUMN code_mode_tarification,
        DROP COLUMN libelle_du_mode_tarification;
    `)
  }
}
