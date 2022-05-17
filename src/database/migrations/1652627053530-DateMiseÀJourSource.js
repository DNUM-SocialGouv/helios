class DateMiseÀJourSource1652627053530 {
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE sourceDeDonnées AS ENUM ('FINESS');

      CREATE TABLE DateMiseÀJourSource
      (
          dernièreMiseÀJour DATE NOT NULL,
          source sourceDeDonnées,

          CONSTRAINT source_primary_key
              PRIMARY KEY (source)
      );`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP TABLE DateMiseÀJourSource;
      DROP TYPE sourceDeDonnées;`
    )
  }
}

module.exports = DateMiseÀJourSource1652627053530
