module.exports = class AjoutNombrePassageUrgencesActivitéSanitaire1657616813991 {

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE activite_sanitaire 
                ADD nombre_passages_urgences FLOAT;`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE activite_sanitaire 
                DROP COLUMN nombre_passage_urgences;`
    )
  }

}
