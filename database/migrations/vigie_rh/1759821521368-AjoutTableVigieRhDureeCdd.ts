import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTableVigieRhDureeCdd1759821521368 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE vigierh_duree_cdd (
            numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
            annee INT NOT NULL, 
            trimestre INT NOT NULL, 
            duree_code INT NOT NULL,
            effectif INT,
            effectif_ref INT,

            PRIMARY KEY (numero_finess_etablissement_territorial, annee, trimestre, duree_code),
            CONSTRAINT vigierh_duree_cdd_etablissement_territorial_finess_foreign_key
            FOREIGN KEY (numero_finess_etablissement_territorial)
              REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
              ON DELETE CASCADE,
            CONSTRAINT duree_code_foreign_key
            FOREIGN KEY (duree_code)
                REFERENCES vigierh_referentiel_duree_cdd (duree_code)
                ON DELETE CASCADE
          );

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'vigierh_duree_cdd';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS vigierh_duree_cdd;");
  }

}
