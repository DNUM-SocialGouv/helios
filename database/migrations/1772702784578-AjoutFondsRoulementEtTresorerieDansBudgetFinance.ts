import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutFondsRoulementEtTresorerieDansBudgetFinance1772702784578 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE budget_et_finances_sanitaire
        ADD COLUMN fonds_de_roulement FLOAT,
        ADD COLUMN besoin_fonds_de_roulement FLOAT,
        ADD COLUMN tresorerie FLOAT;

      ALTER TABLE budget_et_finances_entite_juridique
        ADD COLUMN fonds_de_roulement FLOAT,
        ADD COLUMN besoin_fonds_de_roulement FLOAT,
        ADD COLUMN tresorerie FLOAT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE budget_et_finances_sanitaire
        DROP COLUMN fonds_de_roulement,
        DROP COLUMN besoin_fonds_de_roulement,
        DROP COLUMN tresorerie;

      ALTER TABLE budget_et_finances_entite_juridique
        DROP COLUMN fonds_de_roulement,
        DROP COLUMN besoin_fonds_de_roulement,
        DROP COLUMN tresorerie;
    `);
  }

}
