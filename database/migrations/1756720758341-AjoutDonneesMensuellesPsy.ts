import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutDonneesMensuellesPsy1756720758341 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_sanitaire_mensuel_entite_juridique
      ADD COLUMN nombre_journees_completes_psy FLOAT,
      ADD COLUMN nombre_journees_partielles_psy FLOAT;

      ALTER TABLE activite_sanitaire_mensuel
      ADD COLUMN nombre_journees_completes_psy FLOAT,
      ADD COLUMN nombre_journees_partielles_psy FLOAT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_sanitaire_mensuel_entite_juridique
      DROP COLUMN nombre_journees_completes_psy,
      DROP COLUMN nombre_journees_partielles_psy;

      ALTER TABLE activite_sanitaire_mensuel
      DROP COLUMN nombre_journees_completes_psy,
      DROP COLUMN nombre_journees_partielles_psy;
    `);
  }

}
