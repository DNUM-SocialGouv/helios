import { MigrationInterface, QueryRunner } from "typeorm";

export class PaginationDeLaRecherche1662736499297 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE entite_juridique
        ADD COLUMN termes_de_recherche tsvector GENERATED ALWAYS AS (
            to_tsvector(
              'unaccent_helios',
              coalesce(raison_sociale, '') || ' ' || coalesce(numero_finess_entite_juridique, '') || ' ' || coalesce(commune, '') || ' ' || coalesce(departement, '')
            )
          ) STORED;

      CREATE INDEX recherche_entite_juridique_idx ON entite_juridique USING GIN (termes_de_recherche);

      ALTER TABLE etablissement_territorial
        ADD COLUMN termes_de_recherche tsvector GENERATED ALWAYS AS (
            to_tsvector(
              'unaccent_helios',
              coalesce(raison_sociale, '') || ' ' || coalesce(numero_finess_etablissement_territorial, '') || ' ' || coalesce(commune, '') || ' ' || coalesce(departement, '')
            )
          ) STORED;

      CREATE INDEX recherche_etablissement_territorial_idx ON etablissement_territorial USING GIN (termes_de_recherche);

      CREATE OR REPLACE VIEW recherche AS
        SELECT numero_finess_entite_juridique AS numero_finess,
          raison_sociale,
          'Entité juridique' AS type,
          termes_de_recherche AS termes,
          commune,
          departement
        FROM entite_juridique
        UNION ALL
        SELECT numero_finess_etablissement_territorial AS numero_finess,
          raison_sociale,
          domaine::text AS type,
          termes_de_recherche AS termes,
          commune,
          departement
        FROM etablissement_territorial;
      `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE OR REPLACE VIEW recherche AS
        SELECT
          numero_finess_entite_juridique AS numero_finess,
          raison_sociale,
          'Entité juridique' AS type,
          to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_entite_juridique || ' ' || commune || ' ' || departement) AS termes,
          commune,
          departement
        FROM entite_juridique
        UNION ALL
        SELECT
          numero_finess_etablissement_territorial AS numero_finess,
          raison_sociale,
          domaine::text AS type,
          to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_etablissement_territorial || ' ' || commune || ' ' || departement) AS termes,
          commune,
          departement
        FROM etablissement_territorial;

        DROP INDEX recherche_etablissement_territorial_idx;

        DROP INDEX recherche_entite_juridique_idx;

        ALTER TABLE etablissement_territorial DROP COLUMN termes_de_recherche;

        ALTER TABLE entite_juridique DROP COLUMN termes_de_recherche;
      `);
  }
}
