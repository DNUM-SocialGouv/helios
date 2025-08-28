import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutLibelleCategorieALaRecherche1754309418981 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP VIEW recherche;
    
            CREATE OR REPLACE VIEW recherche AS
        SELECT
          numero_finess_entite_juridique AS numero_finess,
          raison_sociale_courte,
          'Entité juridique' AS type,
          termes_de_recherche AS termes,
          categorisation AS statut_juridique,
          commune,
          departement,
          code_region,
          '' AS rattachement,
          '' AS categorie,
          '' As libelle_categorie
        FROM entite_juridique
        UNION ALL
        SELECT
          numero_finess_etablissement_territorial AS numero_finess,
          raison_sociale_courte,
          domaine::text AS type,
          termes_de_recherche AS termes,
          classification,
          commune,
          departement,
          code_region,
          numero_finess_entite_juridique AS rattachement,
          cat_etablissement AS categorie,
          libelle_court_categorie_etablissement As libelle_categorie
        FROM etablissement_territorial;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP VIEW recherche;
    
       CREATE OR REPLACE VIEW recherche AS
        SELECT
          numero_finess_entite_juridique AS numero_finess,
          raison_sociale_courte,
          'Entité juridique' AS type,
          termes_de_recherche AS termes,
          categorisation AS statut_juridique,
          commune,
          departement,
          code_region,
          '' AS rattachement,
          '' AS categorie
        FROM entite_juridique
        UNION ALL
        SELECT
          numero_finess_etablissement_territorial AS numero_finess,
          raison_sociale_courte,
          domaine::text AS type,
          termes_de_recherche AS termes,
          classification,
          commune,
          departement,
          code_region,
          numero_finess_entite_juridique AS rattachement,
          cat_etablissement AS categorie
        FROM etablissement_territorial;`);
    }

}
