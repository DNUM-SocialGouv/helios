import { MigrationInterface, QueryRunner } from "typeorm";

export class AjouteTypePassageProfessions1764753717478 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'vigierh_table_passage_professions_1_2';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }

}
