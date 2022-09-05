class AjoutDesCapacitésPsy1662368876558 {

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE capacite_autorisation_sanitaire
        ADD nombre_lits_usld INTEGER,
        ADD nombre_lits_ou_places_psy_complet INTEGER,
        ADD nombre_places_psy_partiel INTEGER;`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE capacite_autorisation_sanitaire
        DROP COLUMN nombre_lits_usld,
        DROP COLUMN nombre_lits_ou_places_psy_complet,
        DROP COLUMN nombre_places_psy_partiel;`
    )
  }
}

module.exports = AjoutDesCapacitésPsy1662368876558
