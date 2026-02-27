import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTableNoDataQualiteHasMS1772117266351 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE no_data_qualite_has_ms(
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,

        PRIMARY KEY (numero_finess_etablissement_territorial),

        CONSTRAINT qualite_has_etablissement_territorial_finess_foreign_key
        FOREIGN KEY (numero_finess_etablissement_territorial)
        REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
        ON DELETE CASCADE
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE no_data_qualite_has_ms;
    `);
  }

}
