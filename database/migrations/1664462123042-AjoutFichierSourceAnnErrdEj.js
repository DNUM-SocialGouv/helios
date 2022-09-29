class AjoutFichierSourceAnnErrdEj1664462123042 {
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'ann_errd_ej'
    `)
  }

  async down(queryRunner) { }
}

module.exports = AjoutFichierSourceAnnErrdEj1664462123042
