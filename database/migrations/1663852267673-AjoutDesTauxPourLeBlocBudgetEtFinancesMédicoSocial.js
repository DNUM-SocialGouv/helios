class AjoutDesTauxPourLeBlocBudgetEtFinancesMédicoSocial1663852267673 {
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE budget_et_finances_medico_social
        ADD COLUMN charges FLOAT,
        ADD COLUMN produits FLOAT,
        ADD COLUMN taux_de_caf FLOAT,
        ADD COLUMN taux_de_vetuste_construction FLOAT;

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'ann_ca_ej_et'
    `)
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE budget_et_finances_medico_social
        DROP COLUMN charges,
        DROP COLUMN produits,
        DROP COLUMN taux_de_caf,
        DROP COLUMN taux_de_vetuste_construction;
    `)
  }
}

module.exports = AjoutDesTauxPourLeBlocBudgetEtFinancesMédicoSocial1663852267673
