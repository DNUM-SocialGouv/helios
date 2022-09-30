class AjoutFichierSourceAnnErrdEj1664462123042 {
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE budget_et_finances_medico_social
        ADD COLUMN fonds_de_roulement_net_global float;

      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'ann_errd_ej';
    `)
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE budget_et_finances_medico_social
        DROP COLUMN fonds_de_roulement_net_global;
    `)
  }
}

module.exports = AjoutFichierSourceAnnErrdEj1664462123042
