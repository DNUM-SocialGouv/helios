import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutCodeRegionDansLaRecherche1730971588532 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP VIEW recherche;
  
        CREATE OR REPLACE VIEW recherche AS
        SELECT numero_finess_entite_juridique AS numero_finess,
          raison_sociale_courte,
          'Entité juridique' AS type,
          termes_de_recherche AS termes,
          categorisation AS statut_juridique,
          '' AS classification,
          commune,
          departement,
          code_region
        FROM entite_juridique
        UNION ALL
        SELECT numero_finess_etablissement_territorial AS numero_finess,
          raison_sociale_courte,
          domaine::text AS type,
          termes_de_recherche AS termes,
          '' AS statut_juridique,
          classification,
          commune,
          departement,
          code_region
        FROM etablissement_territorial;
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP VIEW recherche;
  
        CREATE OR REPLACE VIEW recherche AS
        SELECT numero_finess_entite_juridique AS numero_finess,
          raison_sociale_courte,
          'Entité juridique' AS type,
          termes_de_recherche AS termes,
          categorisation AS statut_juridique,
          '' AS classification,
          commune,
          departement
        FROM entite_juridique
        UNION ALL
        SELECT numero_finess_etablissement_territorial AS numero_finess,
          raison_sociale_courte,
          domaine::text AS type,
          termes_de_recherche AS termes,
          '' AS statut_juridique,
          classification,
          commune,
          departement
        FROM etablissement_territorial;
      `);

    }

}
