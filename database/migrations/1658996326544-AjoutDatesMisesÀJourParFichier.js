class AjoutDatesMisesÀJourParFichier1658996326544 {

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE fichier_source AS ENUM
        ('finess_cs1400101', 'finess_cs1400102', 'ann_errd_ej_et', 'ann_ms_tdp_et', 'men_pmsi_annuel', 'ann_rpu');

      CREATE TABLE date_mise_a_jour_fichier_source (
        derniere_mise_a_jour DATE NOT NULL,
        fichier fichier_source NOT NULL,

        CONSTRAINT fichier_primary_key
          PRIMARY KEY (fichier)
      );`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP TABLE date_mise_a_jour_fichier_source;
      DROP TYPE fichier_source;`
    )
  }
}

module.exports = AjoutDatesMisesÀJourParFichier1658996326544
