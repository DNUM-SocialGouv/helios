import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutMotifsRupturesContrats1760516962957 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vigierh_motifs_ruptures(
          finess_et varchar NOT NULL,
          annee int NOT NULL ,
          trimestre int NOT NULL,
          motif_code int NOT NULL,
          effectif int,
          effectif_ref int,
          PRIMARY KEY (finess_et,annee,trimestre,motif_code),
          FOREIGN KEY (motif_code)
                        REFERENCES vigierh_ref_motifs_ruptures (code)
                        ON DELETE CASCADE,
          FOREIGN KEY (finess_et)
                        REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
                        ON DELETE CASCADE);`);

    await queryRunner.query(`ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_motifs_ruptures';`);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS vigierh_motifs_ruptures;`);
  }

}
