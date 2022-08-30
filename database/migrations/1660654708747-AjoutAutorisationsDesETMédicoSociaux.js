class AjoutAutorisationsDesETMédicoSociaux1660654708747 {

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE autorisation_medico_social (
        _autorisation_id SERIAL PRIMARY KEY,
        activite VARCHAR(2) NOT NULL,
        capacite_autorisee_totale INTEGER,
        capacite_installee_totale INTEGER,
        clientele VARCHAR(3) NOT NULL,
        date_autorisation DATE,
        date_derniere_installation DATE,
        date_mise_a_jour_autorisation DATE,
        discipline_equipement VARCHAR(3) NOT NULL,
        est_installee BOOLEAN NOT NULL,
        libelle_activite VARCHAR(255) NOT NULL,
        libelle_clientele VARCHAR(255) NOT NULL,
        libelle_discipline_equipement VARCHAR(255) NOT NULL,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,

        CONSTRAINT autorisation_medico_social_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'finess_cs1400105';`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      'DROP TABLE autorisation_medico_social;'
    )
  }
}

module.exports = AjoutAutorisationsDesETMédicoSociaux1660654708747
