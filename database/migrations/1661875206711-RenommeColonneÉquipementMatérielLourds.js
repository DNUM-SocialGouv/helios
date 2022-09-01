class RenommeColonneÉquipementMatérielLourds1661875206711 {
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE equipement_materiel_lourd
        RENAME COLUMN libelle_equipement_materiel_lourd TO libelle_eml;

      ALTER TABLE equipement_materiel_lourd
        RENAME TO equipement_materiel_lourd_sanitaire;

      ALTER TABLE reconnaissance_contractuelle_sanitaire
        RENAME COLUMN id_cpom TO numero_cpom;`)
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE reconnaissance_contractuelle_sanitaire
      RENAME COLUMN numero_cpom TO id_cpom;

      ALTER TABLE equipement_materiel_lourd_sanitaire
        RENAME TO equipement_materiel_lourd;

      ALTER TABLE equipement_materiel_lourd
        RENAME COLUMN libelle_eml TO libelle_equipement_materiel_lourd;`)
  }
}

module.exports = RenommeColonneÉquipementMatérielLourds1661875206711
