import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutVueRecherche1658238839801 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION unaccent;

      CREATE TEXT SEARCH CONFIGURATION unaccent_helios ( COPY = french );
      ALTER TEXT SEARCH CONFIGURATION unaccent_helios
        ALTER MAPPING FOR hword, hword_part, word
        WITH unaccent, french_stem, simple;

      CREATE VIEW recherche AS
      SELECT
        numero_finess_entite_juridique AS numero_finess,
        raison_sociale,
        'Entité juridique' AS type,
        to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_entite_juridique) AS termes
      FROM entite_juridique
      UNION ALL
      SELECT
        numero_finess_etablissement_territorial AS numero_finess,
        raison_sociale,
        domaine::text AS type,
        to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_etablissement_territorial) AS termes
      FROM etablissement_territorial;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP VIEW recherche;
      DROP TEXT SEARCH CONFIGURATION unaccent_helios;
      DROP EXTENSION unaccent;
    `);
  }
}
