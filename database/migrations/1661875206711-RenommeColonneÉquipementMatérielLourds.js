class RenommeColonneÉquipementMatérielLourds1661875206711 {
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE equipement_materiel_lourd
    RENAME COLUMN libelle_equipement_materiel_lourd TO libelle_eml;`)
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE equipement_materiel_lourd
    RENAME COLUMN libelle_eml TO libelle_equipement_materiel_lourd;`)
  }
}

module.exports = RenommeColonneÉquipementMatérielLourds1661875206711
