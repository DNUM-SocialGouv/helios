class AjoutActivitéMédicoSocial1656002701263 {
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE ActivitéMédicoSocial
      (
          année INT NOT NULL,
          numéroFinessÉtablissementTerritorial VARCHAR(9) NOT NULL,
          tauxDOccupationDesLitsAutorisésEnAccueilDeJour FLOAT,
          tauxDOccupationDesLitsAutorisésEnHébergementTemporaire FLOAT,
          tauxDOccupationDesPlacesAutoriséesEnHébergementPermanent FLOAT,
          PRIMARY KEY (année, numéroFinessÉtablissementTerritorial),

          CONSTRAINT activité_médico_social_établissement_territorial_finess_foreign_key
              FOREIGN KEY (numéroFinessÉtablissementTerritorial)
                  REFERENCES ÉtablissementTerritorialIdentité (numéroFinessÉtablissementTerritorial)
                  ON DELETE CASCADE
         
      );`
    )
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE ActivitéMédicoSocial')
  }

}

module.exports = AjoutActivitéMédicoSocial1656002701263
