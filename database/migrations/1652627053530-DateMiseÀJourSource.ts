import { MigrationInterface, QueryRunner } from 'typeorm'

export class DateMiseÀJourSource1652627053530 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE source_de_donnees AS ENUM ('FINESS');

      CREATE TABLE date_mise_a_jour_source (
        derniere_mise_a_jour DATE NOT NULL,
        source source_de_donnees,

        CONSTRAINT source_primary_key
          PRIMARY KEY (source)
      );
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE date_mise_a_jour_source;
      DROP TYPE source_de_donnees;
    `)
  }
}
