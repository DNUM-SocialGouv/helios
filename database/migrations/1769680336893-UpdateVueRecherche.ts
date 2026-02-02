import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVueRecherche1769680336893 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS unaccent;

      ALTER TEXT SEARCH CONFIGURATION unaccent_helios
      ALTER MAPPING FOR hword, hword_part, word, asciiword, asciihword
      WITH unaccent, simple;

      DROP INDEX IF EXISTS recherche_etablissement_territorial_idx;
      DROP INDEX IF EXISTS recherche_entite_juridique_idx;
      DROP VIEW IF EXISTS recherche;

      ALTER TABLE entite_juridique DROP COLUMN termes_de_recherche;

      ALTER TABLE entite_juridique
          ADD COLUMN termes_de_recherche tsvector GENERATED ALWAYS AS (
              to_tsvector(
                  'unaccent_helios',
                  coalesce(raison_sociale, '') || ' ' ||
                  coalesce(raison_sociale_courte, '') || ' ' ||
                  coalesce(numero_finess_entite_juridique, '') || ' ' ||
                  coalesce(commune, '') || ' ' ||
                  coalesce(departement, '')
              )
          ) STORED;

      CREATE INDEX recherche_entite_juridique_idx ON entite_juridique USING GIN (termes_de_recherche);

      ALTER TABLE etablissement_territorial DROP COLUMN termes_de_recherche;

      ALTER TABLE etablissement_territorial
          ADD COLUMN termes_de_recherche tsvector GENERATED ALWAYS AS (
              to_tsvector(
                  'unaccent_helios',
                  coalesce(raison_sociale, '') || ' ' ||
                  coalesce(raison_sociale_courte, '') || ' ' ||
                  coalesce(numero_finess_etablissement_territorial, '') || ' ' ||
                  coalesce(commune, '') || ' ' ||
                  coalesce(departement, '')
              )
          ) STORED;

      CREATE INDEX recherche_etablissement_territorial_idx ON etablissement_territorial USING GIN (termes_de_recherche);

      CREATE OR REPLACE VIEW recherche AS
        SELECT
          numero_finess_entite_juridique AS numero_finess,
          raison_sociale_courte,
          'Entité juridique' AS type,
          termes_de_recherche AS termes,
          categorisation AS statut_juridique,
          commune,
          departement,
          code_region,
          '' AS rattachement,
          '' AS categorie,
          '' As libelle_categorie
        FROM entite_juridique
        UNION ALL
        SELECT
          numero_finess_etablissement_territorial AS numero_finess,
          raison_sociale_courte,
          domaine::text AS type,
          termes_de_recherche AS termes,
          classification,
          commune,
          departement,
          code_region,
          numero_finess_entite_juridique AS rattachement,
          cat_etablissement AS categorie,
          libelle_court_categorie_etablissement As libelle_categorie
        FROM etablissement_territorial;
    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TEXT SEARCH CONFIGURATION unaccent_helios;
      DROP EXTENSION IF EXISTS unaccent;
    `);
  }

}
