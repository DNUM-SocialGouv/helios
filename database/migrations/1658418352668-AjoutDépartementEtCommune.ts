import { MigrationInterface, QueryRunner } from 'typeorm'

export class AjoutDépartementEtCommune1658418352668 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE entite_juridique
        ADD commune VARCHAR(255) NOT NULL DEFAULT (''),
        ADD departement VARCHAR(255) NOT NULL DEFAULT ('');

      ALTER TABLE etablissement_territorial
        ADD commune VARCHAR(255) NOT NULL DEFAULT (''),
        ADD departement VARCHAR(255) NOT NULL DEFAULT ('');

      CREATE OR REPLACE VIEW recherche AS
        SELECT
          numero_finess_entite_juridique AS numero_finess,
          raison_sociale,
          'Entité juridique' AS type,
          to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_entite_juridique) AS termes,
          commune,
          departement
        FROM entite_juridique
        UNION ALL
        SELECT
          numero_finess_etablissement_territorial AS numero_finess,
          raison_sociale,
          domaine::text AS type,
          to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_etablissement_territorial) AS termes,
          commune,
          departement
        FROM etablissement_territorial;
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP VIEW recherche;

      ALTER TABLE entite_juridique
        DROP COLUMN commune,
        DROP COLUMN departement;

      ALTER TABLE etablissement_territorial
        DROP COLUMN commune,
        DROP COLUMN departement;

      CREATE VIEW recherche AS
      SELECT
        numero_finess_entite_juridique AS numero_finess,
        raison_sociale,
        'Entité juridique' AS type,
        to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_entite_juridique) AS termes
      FROM entite_juridique
      UNION ALL
      SELECT
        numero_finess_etablissement_territorial AS numero_finess,
        raison_sociale,
        domaine::text AS type,
        to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_etablissement_territorial) AS termes
      FROM etablissement_territorial;
    `)
  }
}
