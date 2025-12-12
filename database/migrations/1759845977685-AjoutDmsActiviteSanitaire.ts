import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutDmsActiviteSanitaire1759845977685 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_sanitaire_entite_juridique
      ADD COLUMN duree_moyenne_sejour_medecine FLOAT,
      ADD COLUMN duree_moyenne_sejour_chirurgie FLOAT,
      ADD COLUMN duree_moyenne_sejour_obstetrique FLOAT;

      ALTER TABLE activite_sanitaire
      ADD COLUMN duree_moyenne_sejour_medecine FLOAT,
      ADD COLUMN duree_moyenne_sejour_chirurgie FLOAT,
      ADD COLUMN duree_moyenne_sejour_obstetrique FLOAT;
     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_sanitaire_entite_juridique
      DROP COLUMN duree_moyenne_sejour_medecine FLOAT,
      DROP COLUMN duree_moyenne_sejour_chirurgie FLOAT,
      DROP COLUMN duree_moyenne_sejour_obstetrique FLOAT;

      ALTER TABLE activite_sanitaire
      DROP COLUMN duree_moyenne_sejour_medecine FLOAT,
      DROP COLUMN duree_moyenne_sejour_chirurgie FLOAT,
      DROP COLUMN duree_moyenne_sejour_obstetrique FLOAT;
    `);
  }
}
