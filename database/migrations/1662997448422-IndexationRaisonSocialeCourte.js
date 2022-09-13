class IndexationRaisonSocialeCourte1662997448422 {
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE entite_juridique
        ADD COLUMN raison_sociale_courte VARCHAR(255);

      ALTER TABLE etablissement_territorial
        ADD COLUMN raison_sociale_courte VARCHAR(255),
        ADD COLUMN libelle_court_categorie_etablissement VARCHAR(255);

      DROP VIEW recherche;

      DROP INDEX recherche_entite_juridique_idx;

      ALTER TABLE entite_juridique
        DROP COLUMN termes_de_recherche;

      DROP INDEX recherche_etablissement_territorial_idx;

      ALTER TABLE etablissement_territorial
        DROP COLUMN termes_de_recherche;

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

      ALTER TABLE etablissement_territorial
        ADD COLUMN termes_de_recherche tsvector GENERATED ALWAYS AS (
            to_tsvector(
              'unaccent_helios',
              coalesce(raison_sociale, '') || ' ' ||
              coalesce(raison_sociale_courte, '') || ' ' ||
              coalesce(numero_finess_etablissement_territorial, '') || ' ' ||
              coalesce(libelle_categorie_etablissement, '') || ' ' ||
              coalesce(libelle_court_categorie_etablissement, '') || ' ' ||
              coalesce(commune, '') || ' ' ||
              coalesce(departement, '')
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
    `)
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DROP VIEW recherche;

      DROP INDEX recherche_entite_juridique_idx;

      ALTER TABLE entite_juridique
        DROP COLUMN termes_de_recherche;

      DROP INDEX recherche_etablissement_territorial_idx;

      ALTER TABLE etablissement_territorial
        DROP COLUMN termes_de_recherche;

      ALTER TABLE entite_juridique
        ADD COLUMN termes_de_recherche tsvector GENERATED ALWAYS AS (
            to_tsvector(
              'unaccent_helios',
              coalesce(raison_sociale, '') || ' ' ||
              coalesce(numero_finess_entite_juridique, '') || ' ' ||
              coalesce(commune, '') || ' ' ||
              coalesce(departement, '')
            )
          ) STORED;

      CREATE INDEX recherche_entite_juridique_idx ON entite_juridique USING GIN (termes_de_recherche);

      ALTER TABLE etablissement_territorial
        ADD COLUMN termes_de_recherche tsvector GENERATED ALWAYS AS (
            to_tsvector(
              'unaccent_helios',
              coalesce(raison_sociale, '') || ' ' ||
              coalesce(numero_finess_etablissement_territorial, '') || ' ' ||
              coalesce(commune, '') || ' ' ||
              coalesce(departement, '')
            )
          ) STORED;

      CREATE INDEX recherche_etablissement_territorial_idx ON etablissement_territorial USING GIN (termes_de_recherche);

      ALTER TABLE etablissement_territorial
        DROP COLUMN libelle_court_categorie_etablissement,
        DROP COLUMN raison_sociale_courte;

      ALTER TABLE entite_juridique
        DROP COLUMN raison_sociale_courte;

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
    `)
  }
}

module.exports = IndexationRaisonSocialeCourte1662997448422
