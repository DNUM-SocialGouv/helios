import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutDmsActiviteMensuel1759826053430 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_sanitaire_mensuel_entite_juridique
      ADD COLUMN duree_moyenne_sejour_medecine FLOAT,
      ADD COLUMN duree_moyenne_sejour_chirurgie FLOAT,
      ADD COLUMN duree_moyenne_sejour_obstetrique FLOAT;

      ALTER TABLE activite_sanitaire_mensuel
      ADD COLUMN duree_moyenne_sejour_medecine FLOAT,
      ADD COLUMN duree_moyenne_sejour_chirurgie FLOAT,
      ADD COLUMN duree_moyenne_sejour_obstetrique FLOAT;
     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_sanitaire_mensuel_entite_juridique
      DROP COLUMN duree_moyenne_sejour_medecine FLOAT,
      DROP COLUMN duree_moyenne_sejour_chirurgie FLOAT,
      DROP COLUMN duree_moyenne_sejour_obstetrique FLOAT;

      ALTER TABLE activite_sanitaire_mensuel
      DROP COLUMN duree_moyenne_sejour_medecine FLOAT,
      DROP COLUMN duree_moyenne_sejour_chirurgie FLOAT,
      DROP COLUMN duree_moyenne_sejour_obstetrique FLOAT;
    `);
  }

}
