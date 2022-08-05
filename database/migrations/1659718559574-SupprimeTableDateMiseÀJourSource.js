module.exports = class SupprimeTableDateMiseÀJourSource1659718559574 {
  async up(queryRunner) {
    await queryRunner.query(
      `DROP TABLE date_mise_a_jour_source;
       DROP TYPE source_de_donnees;`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE source_de_donnees AS ENUM ('FINESS');

       CREATE TABLE date_mise_a_jour_source (
         derniere_mise_a_jour DATE NOT NULL,
         source source_de_donnees,

         CONSTRAINT source_primary_key PRIMARY KEY (source)
       );`
    )
  }
}
