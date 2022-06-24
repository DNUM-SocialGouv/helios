class AjoutActivitéMédicoSocial1656002701263 {
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE ActivitéMédicoSocial
      (
          année INT NOT NULL,
          numérofinessÉtablissementterritorial VARCHAR(9) NOT NULL,
          tauxDOccupationDesLitsAutorisésEnAccueilDeJour FLOAT,
          tauxDOccupationDesLitsAutorisésEnHébergementTemporaire FLOAT,
          tauxDOccupationDesPlacesAutoriséesEnHébergementPermanent FLOAT,
          UNIQUE(année, numérofinessÉtablissementterritorial),

          CONSTRAINT activité_médico_social_établissement_territorial_finess_foreign_key
              FOREIGN KEY (numérofinessÉtablissementterritorial)
                  REFERENCES Établissementterritorialidentité (numérofinessÉtablissementterritorial)
                  ON DELETE CASCADE
         
      );`
    )
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE ActivitéMédicoSocial')
  }

}

module.exports = AjoutActivitéMédicoSocial1656002701263
