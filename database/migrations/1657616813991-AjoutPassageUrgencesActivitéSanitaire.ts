import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutNombrePassageUrgencesActivitéSanitaire1657616813991 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_sanitaire
        ADD nombre_passages_urgences FLOAT;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_sanitaire
        DROP COLUMN nombre_passages_urgences;
    `);
  }
}
