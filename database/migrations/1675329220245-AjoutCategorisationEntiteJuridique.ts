import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutCategorisationEntiteJuridique1675329220245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE entite_juridique
        ADD COLUMN categorisation VARCHAR(30);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE entite_juridique
        DROP COLUMN categorisation;`);
  }
}
