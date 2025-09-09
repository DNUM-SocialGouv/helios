import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTableVigieRhMouvementsRH1757337280336 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE vigierh_mouvements (
            numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
            annee INT NOT NULL, 
            nouveaux_contrats INT,
            nouveaux_contrats_ref INT,
            fins_contrats INT,
            fins_contrats_ref INT,
            taux_rotation FLOAT,
            taux_rotation_ref FLOAT,
    
            PRIMARY KEY (numero_finess_etablissement_territorial, annee),
            CONSTRAINT vigierh_mouvements_etablissement_territorial_finess_foreign_key
            FOREIGN KEY (numero_finess_etablissement_territorial)
              REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
              ON DELETE CASCADE
          );

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'vigierh_etablissement_annuel';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS vigierh_mouvements;");
  }

}
