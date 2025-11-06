import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutReferentielMotifsRupturesContrats1760516933359 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vigierh_ref_motifs_ruptures(
                code int PRIMARY KEY,
                motif varchar NOT NULL);`);
    await queryRunner.query(`ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_motifs_ruptures';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS vigierh_ref_motifs_ruptures;`);
  }

}
