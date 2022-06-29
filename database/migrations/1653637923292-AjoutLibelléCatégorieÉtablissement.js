class AjoutLibelléCatégorieÉtablissement1653637923292 {

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE etablissement_territorial_identite
      ADD libelle_categorie_etablissement VARCHAR(255) NOT NULL DEFAULT ('');`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE etablissement_territorial_identite
      DROP COLUMN libelle_categorie_etablissement;`
    )
  }
}

module.exports = AjoutLibelléCatégorieÉtablissement1653637923292
