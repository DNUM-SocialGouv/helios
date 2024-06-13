import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutTableAllocationRessourceET1718177983190 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE allocation_ressource_et (
            id bigserial NOT NULL,
            annee INT NOT NULL,
            numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
            mois VARCHAR(255) NOT NULL,
            enveloppe VARCHAR(255) NOT NULL,
            sous_enveloppe VARCHAR(255) NOT NULL,
            mode_delegation VARCHAR(255) NOT NULL,
            montant FLOAT NOT NULL,
   
            PRIMARY KEY (id),
   
            CONSTRAINT allocation_ressource_etablissement_territorial_foreign_key
            FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
          );

        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE allocation_ressource_et;");
    }

}
