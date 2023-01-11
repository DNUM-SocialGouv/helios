import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutDomaineÉtablissement1654002237462 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE domaine_et AS ENUM ('Médico-social','Sanitaire');
        ALTER TABLE etablissement_territorial
        ADD domaine domaine_et NOT NULL DEFAULT ('Médico-social');
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ÉtablissementTerritorialIdentité
        DROP COLUMN domaine;
        DROP TYPE domaine_et;
    `);
  }
}
