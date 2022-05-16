import { MigrationInterface, QueryRunner } from 'typeorm'

export class ÉtablissementTerritorialIdentité1652627040870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE ÉtablissementTerritorialIdentité
      (
          adresseAcheminement VARCHAR(255) NOT NULL,
          adresseNuméroVoie VARCHAR(5) NOT NULL,
          adresseTypeVoie VARCHAR(4) NOT NULL,
          adresseVoie VARCHAR(255) NOT NULL,
          catÉtablissement VARCHAR(3) NOT NULL,
          courriel VARCHAR(255) NOT NULL,
          numéroFinessEntitéJuridique VARCHAR(9) NOT NULL,
          numéroFinessÉtablissementPrincipal VARCHAR(9) NOT NULL,
          numéroFinessÉtablissementTerritorial VARCHAR(9) NOT NULL,
          raisonSociale VARCHAR(255) NOT NULL,
          téléphone VARCHAR(10) NOT NULL,
          typeÉtablissement VARCHAR(1) NOT NULL,

          CONSTRAINT établissement_territorial_identité_primary_key
              PRIMARY KEY (numéroFinessÉtablissementTerritorial),

          CONSTRAINT établissement_territorial_identité_entité_juridique_finess_foreign_key
              FOREIGN KEY (numéroFinessEntitéJuridique)
              REFERENCES EntitéJuridique (numéroFinessEntitéJuridique)
              ON DELETE CASCADE
      );`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP TABLE ÉtablissementTerritorialIdentité;'
    )
  }
}
