import { MigrationInterface, QueryRunner } from 'typeorm'

export class EntitéJuridique1652626977208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE EntitéJuridique
      (
          adresseAcheminement VARCHAR(255) NOT NULL,
          adresseNuméroVoie VARCHAR(5) NOT NULL,
          adresseTypeVoie VARCHAR(4) NOT NULL,
          adresseVoie VARCHAR(255) NOT NULL,
          libelléStatutJuridique VARCHAR(255) NOT NULL,
          numéroFinessEntitéJuridique VARCHAR(9) NOT NULL,
          raisonSociale VARCHAR(255) NOT NULL,
          téléphone VARCHAR(10) NOT NULL,

          CONSTRAINT entité_juridique_primary_key PRIMARY KEY (numéroFinessEntitéJuridique)
      );`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP TABLE EntitéJuridique;'
    )
  }
}
