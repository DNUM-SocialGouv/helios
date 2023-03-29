import { MigrationInterface, QueryRunner } from "typeorm";

export class AjouteHAD1680014929754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE activite_sanitaire
                ADD COLUMN nombre_sejours_had FLOAT;

            ALTER TABLE activite_sanitaire_entite_juridique
                ADD COLUMN nombre_sejours_had FLOAT;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE activite_sanitaire
                DROP COLUMN nombre_sejours_had;

            ALTER TABLE activite_sanitaire_entite_juridique
                DROP COLUMN nombre_sejours_had;
      `);
  }
}
