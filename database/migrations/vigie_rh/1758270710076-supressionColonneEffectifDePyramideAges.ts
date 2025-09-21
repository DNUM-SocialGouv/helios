import { MigrationInterface, QueryRunner } from "typeorm";

export class SupressionColonneEffectifDePyramideAges1758270710076 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vigierh_pyramide DROP COLUMN effectif;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vigierh_pyramide ADD COLUMN effectif INT;`);
  }
}
