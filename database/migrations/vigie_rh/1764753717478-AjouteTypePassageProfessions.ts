import { MigrationInterface, QueryRunner } from "typeorm";

export class AjouteTypePassageProfessions1764753717478 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'vigierh_table_passage_professions_1_2';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // eslint-disable-next-line no-console
    console.warn("WARNING: Cannot rollback enum value addition in PostgreSQL. Manual intervention required if rollback is needed.");
    await queryRunner.query(``);
  }

}
