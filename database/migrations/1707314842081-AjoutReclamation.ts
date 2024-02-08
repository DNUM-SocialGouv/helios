import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutReclamation1707314842081 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE reclamation (
            id bigserial PRIMARY KEY,
            id_reclamation VARCHAR(13) UNIQUE NOT NULL,
            ndeg_finess_rpps VARCHAR(9) NOT NULL,
            annee_de_reception INTEGER,

            encours_total INTEGER,
            encours_motif_10 INTEGER,
            encours_motif_11 INTEGER,
            encours_motif_12 INTEGER,
            encours_motif_13 INTEGER,
            encours_motif_14 INTEGER,
            encours_motif_15 INTEGER,
            encours_motif_16 INTEGER,
            encours_motif_17 INTEGER,
            encours_motif_18 INTEGER,
            encours_motif_19 INTEGER,
            encours_motif_155 INTEGER,
            encours_motif_156 INTEGER,

            clot_total INTEGER,
            clot_motif_10 INTEGER,
            clot_motif_11 INTEGER,
            clot_motif_12 INTEGER,
            clot_motif_13 INTEGER,
            clot_motif_14 INTEGER,
            clot_motif_15 INTEGER,
            clot_motif_16 INTEGER,
            clot_motif_17 INTEGER,
            clot_motif_18 INTEGER,
            clot_motif_19 INTEGER,
            clot_motif_155 INTEGER,
            clot_motif_156 INTEGER,
            dateCreation timestamp)
          `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE reclamation");
  }
}
