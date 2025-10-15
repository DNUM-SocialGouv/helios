import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutMotifsRupturesContrats1760516962957 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vigierh_motifs_ruptures(
              finess_et varchar PRIMARY KEY ,
              annee int NOT NULL ,
              trimestre int NOT NULL,
              motif_code int REFERENCES vigierh_ref_motifs_ruptures(code),
              effectif int,
              effectif_ref int
              );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS vigierh_motifs_ruptures;`);
  }
  
}
