class AjoutDomaineÉtablissement1654002237462 {

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE domaine_et AS ENUM ('Médico-social','Sanitaire');
      ALTER TABLE etablissement_territorial_identite
      ADD domaine domaine_et NOT NULL DEFAULT ('Médico-social');`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE ÉtablissementTerritorialIdentité
      DROP COLUMN domaine;
      DROP TYPE domaine_et;`
    )
  }
}

module.exports = AjoutDomaineÉtablissement1654002237462
