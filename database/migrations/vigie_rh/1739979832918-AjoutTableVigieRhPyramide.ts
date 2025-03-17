import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutTableVigieRhPyramide1739979832918 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE vigierh_pyramide (
            numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
            annee INT NOT NULL, 
            effectif INT,
            tranche_code INT NOT NULL,
            effectif_homme INT,
            effectif_femme INT,
            effectif_homme_ref INT,
            effectif_femme_ref INT,
    
            PRIMARY KEY (numero_finess_etablissement_territorial, annee, tranche_code),
            CONSTRAINT autorisation_medico_social_etablissement_territorial_finess_foreign_key
            FOREIGN KEY (numero_finess_etablissement_territorial)
              REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
              ON DELETE CASCADE,
            CONSTRAINT tranche_code_foreign_key
            FOREIGN KEY (tranche_code)
                REFERENCES vigierh_referentiel_tranche_age (code_tranche_age)
                ON DELETE CASCADE
          );

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'vigierh_pyramide';
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS vigierh_pyramide;");
    }

}
