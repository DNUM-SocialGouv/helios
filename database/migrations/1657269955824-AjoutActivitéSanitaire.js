class AjoutActivitéSanitaire1657269955824 {
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE activite_sanitaire (
        annee INT NOT NULL,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
        nombre_sejours_partiels_medecine FLOAT,
        nombre_sejours_partiels_obstetrique FLOAT,
        nombre_sejours_partiels_chirurgie FLOAT,
        nombre_sejours_complets_medecine FLOAT,
        nombre_sejours_complets_obstetrique FLOAT,
        nombre_sejours_complets_chirurgie FLOAT,
        nombre_journees_completes_ssr FLOAT,
        nombre_journees_partiels_ssr FLOAT,
        nombre_journees_complete_psy FLOAT,
        nombre_journées_partielles_psy FLOAT,

        PRIMARY KEY (annee, numero_finess_etablissement_territorial),

        CONSTRAINT activite_sanitaire_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
          REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
          ON DELETE CASCADE
        );`
    )
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE activite_sanitaire')
  }
}

module.exports = AjoutActivitéSanitaire1657269955824
