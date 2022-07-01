class ÉtablissementTerritorial1652627040870 {
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE etablissement_territorial (
        adresse_acheminement VARCHAR(255) NOT NULL,
        adresse_numero_voie VARCHAR(5) NOT NULL,
        adresse_type_voie VARCHAR(4) NOT NULL,
        adresse_voie VARCHAR(255) NOT NULL,
        cat_etablissement VARCHAR(3) NOT NULL,
        courriel VARCHAR(255) NOT NULL,
        libelle_categorie_etablissement VARCHAR(255) NOT NULL,
        numero_finess_entite_juridique VARCHAR(9) NOT NULL,
        numero_finess_etablissement_principal VARCHAR(9) NOT NULL,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
        raison_sociale VARCHAR(255) NOT NULL,
        telephone VARCHAR(10) NOT NULL,
        type_etablissement VARCHAR(1) NOT NULL,

        CONSTRAINT etablissement_territorial_identite_primary_key
          PRIMARY KEY (numero_finess_etablissement_territorial),

        CONSTRAINT etablissement_territorial_identite_entite_juridique_finess_foreign_key
          FOREIGN KEY (numero_finess_entite_juridique)
          REFERENCES entite_juridique (numero_finess_entite_juridique)
          ON DELETE CASCADE
      );`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      'DROP TABLE etablissement_territorial;'
    )
  }
}

module.exports = ÉtablissementTerritorial1652627040870
