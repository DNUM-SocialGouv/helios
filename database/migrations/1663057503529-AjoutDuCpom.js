class AjoutDuCpom1663057503529 {
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE cpom (
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
        date_d_entree_en_vigueur DATE,

        CONSTRAINT cpom_primary_key
            PRIMARY KEY (numero_finess_etablissement_territorial),
        
        CONSTRAINT cpom_numero_finess_etablissement_territorial_foreign_key
        FOREIGN KEY (numero_finess_etablissement_territorial)
        REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
        ON DELETE CASCADE
      );`
    )
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE cpom')
  }
}

module.exports = AjoutDuCpom1663057503529
