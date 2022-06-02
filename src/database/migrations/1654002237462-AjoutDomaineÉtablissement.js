class AjoutDomaineÉtablissement1654002237462 {

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE domaineET AS ENUM ('Médico-social','Sanitaire');
      ALTER TABLE ÉtablissementTerritorialIdentité
      ADD domaine domaineET NOT NULL DEFAULT ('Médico-social');`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE ÉtablissementTerritorialIdentité
      DROP COLUMN domaine;
      DROP TYPE domaineET;`
    )
  }
}

module.exports = AjoutDomaineÉtablissement1654002237462
