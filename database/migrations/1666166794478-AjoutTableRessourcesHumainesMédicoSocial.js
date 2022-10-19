class AjoutTableRessourcesHumainesMédicoSocial1666166794478 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE ressources_humaines_medico_social (
        annee INT NOT NULL,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,

        nombre_cdd_remplacement FLOAT,
        nombre_etp_realises FLOAT,
        taux_etp_vacants FLOAT,
        taux_prestation_externes FLOAT,
        taux_rotation_personnel FLOAT,
        taux_absenteisme_maladie_courte_duree FLOAT,
        taux_absenteisme_maladie_moyenne_duree FLOAT,
        taux_absenteisme_maladie_longue_duree FLOAT,
        taux_absenteisme_maternite_paternite FLOAT,
        taux_absenteisme_accident_maladie_professionnelle FLOAT,
        taux_absenteisme_conges_speciaux FLOAT,
        taux_absenteisme_hors_formation FLOAT,

        PRIMARY KEY (annee, numero_finess_etablissement_territorial),

        CONSTRAINT ressources_humaines_medico_social_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );
    `)
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE ressources_humaines_medico_social;')
  }
}

module.exports = AjoutTableRessourcesHumainesMédicoSocial1666166794478
