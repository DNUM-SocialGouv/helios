import { MigrationInterface, QueryRunner } from 'typeorm'

export class DateMiseÀJourSource1652627053530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE sourceDeDonnées AS ENUM ('FINESS');

      CREATE TABLE DateMiseÀJourSource
      (
          dernièreMiseÀJour DATE NOT NULL,
          source sourceDeDonnées,

          CONSTRAINT source_primary_key
              PRIMARY KEY (source)
      );`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE DateMiseÀJourSource;
      DROP TYPE sourceDeDonnées;`
    )
  }
}
