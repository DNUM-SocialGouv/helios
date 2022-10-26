import { MigrationInterface, QueryRunner } from 'typeorm'

export class AjoutSiren1666796630419 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE entite_juridique
        ADD COLUMN siren VARCHAR(9) NOT NULL;
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE entite_juridique
        DROP COLUMN siren;
    `)
  }
}
