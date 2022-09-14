class AjoutThesaurus1663167391130 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TEXT SEARCH DICTIONARY helios_stem (
        TEMPLATE = thesaurus,
        DictFile = thesaurus_helios,
        Dictionary = french_stem
      );

      ALTER TEXT SEARCH CONFIGURATION unaccent_helios
      ALTER MAPPING FOR asciiword, asciihword, hword_asciipart
      WITH helios_stem, unaccent, french_stem;
    `)
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TEXT SEARCH CONFIGURATION unaccent_helios
      ALTER MAPPING FOR asciiword, asciihword, hword_asciipart
      WITH french_stem;

      DROP TEXT SEARCH DICTIONARY helios_stem;
    `)
  }
}

module.exports = AjoutThesaurus1663167391130
