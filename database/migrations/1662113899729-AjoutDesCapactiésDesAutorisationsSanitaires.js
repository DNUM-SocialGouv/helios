class AjoutDesCapactiésDesAutorisationsSanitaires1662113899729 {
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE capacite_autorisation_sanitaire (
        nombre_lits_chirurgie FLOAT,
        nombre_lits_médecine FLOAT,
        nombre_lits_obstétrique FLOAT,
        nombre_lits_ssr FLOAT,
        nombre_places_chirurgie FLOAT,
        nombre_places_médecine FLOAT,
        nombre_places_obstétrique FLOAT,
        nombre_places_ssr FLOAT,
        numero_finess_etablissement_territorial VARCHAR(9) PRIMARY KEY,

        CONSTRAINT capacite_autorisation_sanitaire_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'ann_sae';`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      'DROP TABLE capacite_autorisation_sanitaire'
    )
  }
}

module.exports = AjoutDesCapactiésDesAutorisationsSanitaires1662113899729
