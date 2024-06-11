import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutTableAllocationRessource1718010452960 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE allocation_ressource_ej (
            annee INT NOT NULL,
            numero_finess_entite_juridique VARCHAR(9) NOT NULL,
            mois VARCHAR(255) NOT NULL,

            enveloppe VARCHAR(255) NOT NULL,
            sous_enveloppe VARCHAR(255) NOT NULL,
            mode_delegation VARCHAR(255) NOT NULL,
            montant FLOAT NOT NULL,
   
            PRIMARY KEY (annee, numero_finess_entite_juridique, mois),
   
            CONSTRAINT allocation_ressource_entite_juridique_foreign_key
            FOREIGN KEY (numero_finess_entite_juridique)
            REFERENCES entite_juridique(numero_finess_entite_juridique)
            ON DELETE CASCADE
          );

          ALTER TYPE fichier_source
            ADD VALUE IF NOT EXISTS 'men_hapi';
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE allocation_ressource_ej;");
  }

}
