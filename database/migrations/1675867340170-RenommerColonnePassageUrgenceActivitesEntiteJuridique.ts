import { MigrationInterface, QueryRunner } from "typeorm";

export class RenommerColonnePassageUrgenceActivitesEntiteJuridique1675867340170 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE helios.public.activite_sanitaire_entite_juridique
            RENAME COLUMN nombre_passages_urgences to nombre_passage_urgence`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE helios.public.activite_sanitaire_entite_juridique
            RENAME COLUMN nombre_passage_urgence to nombre_passages_urgences`);
  }
}
