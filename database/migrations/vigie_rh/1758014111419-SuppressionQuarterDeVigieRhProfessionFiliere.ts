import { MigrationInterface, QueryRunner } from "typeorm";

export class SuppressionQuarterDeVigieRhProfessionFiliere1758014111419 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vigierh_profession_filiere DROP COLUMN quarter;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vigierh_profession_filiere ADD COLUMN quarter INT NOT NULL;`);
  }
}
