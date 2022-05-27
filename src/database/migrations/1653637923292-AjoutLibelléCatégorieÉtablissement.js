class AjoutLibelléCatégorieÉtablissement1653637923292 {

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE ÉtablissementTerritorialIdentité
      ADD libelléCatégorieÉtablissement VARCHAR(255) NOT NULL;`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE ÉtablissementTerritorialIdentité
      DROP COLUMN libelléCatégorieÉtablissement;`
    )
  }
}

module.exports = AjoutLibelléCatégorieÉtablissement1653637923292
