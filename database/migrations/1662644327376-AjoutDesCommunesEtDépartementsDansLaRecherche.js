class AjoutDesCommunesEtDépartementsDansLaRecherche1662644327376 {

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE OR REPLACE VIEW recherche AS
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
    FROM etablissement_territorial;`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `CREATE OR REPLACE VIEW recherche AS
    SELECT
      numero_finess_entite_juridique AS numero_finess,
      raison_sociale,
      'Entité juridique' AS type,
      to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_entite_juridique) AS termes,
      commune,
      departement
    FROM entite_juridique
    UNION ALL
    SELECT
      numero_finess_etablissement_territorial AS numero_finess,
      raison_sociale,
      domaine::text AS type,
      to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_etablissement_territorial || ' ' || commune) AS termes,
      commune,
      departement
    FROM etablissement_territorial;`
    )
  }

}

module.exports = AjoutDesCommunesEtDépartementsDansLaRecherche1662644327376
