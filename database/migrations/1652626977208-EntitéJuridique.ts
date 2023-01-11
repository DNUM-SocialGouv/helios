import { MigrationInterface, QueryRunner } from "typeorm";

export class EntitéJuridique1652626977208 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE entite_juridique (
        adresse_acheminement VARCHAR(255) NOT NULL,
        adresse_numero_voie VARCHAR(5) NOT NULL,
        adresse_type_voie VARCHAR(4) NOT NULL,
        adresse_voie VARCHAR(255) NOT NULL,
        libelle_statut_juridique VARCHAR(255) NOT NULL,
        numero_finess_entite_juridique VARCHAR(9) NOT NULL,
        raison_sociale VARCHAR(255) NOT NULL,
        telephone VARCHAR(10) NOT NULL,

        CONSTRAINT entite_juridique_primary_key PRIMARY KEY (numero_finess_entite_juridique)
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE entite_juridique;");
  }
}
