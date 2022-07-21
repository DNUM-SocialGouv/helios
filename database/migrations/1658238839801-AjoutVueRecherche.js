class AjoutVueRecherche1658238839801 {

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE EXTENSION unaccent;

      CREATE TEXT SEARCH CONFIGURATION unaccent_helios ( COPY = french );
      ALTER TEXT SEARCH CONFIGURATION unaccent_helios
        ALTER MAPPING FOR hword, hword_part, word
        WITH unaccent, french_stem, simple;

      CREATE VIEW recherche AS
      SELECT
        numero_finess_entite_juridique AS numero_finess,
        raison_sociale,
        'Entité juridique' AS domaine,
        to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_entite_juridique) AS termes
      FROM entite_juridique
      UNION ALL
      SELECT
        numero_finess_etablissement_territorial AS numero_finess,
        raison_sociale,
        domaine::text,
        to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_etablissement_territorial) AS termes
      FROM etablissement_territorial;`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP VIEW recherche;
      DROP TEXT SEARCH CONFIGURATION unaccent_helios;
      DROP EXTENSION unaccent;`
    )
  }
}

module.exports = AjoutVueRecherche1658238839801
