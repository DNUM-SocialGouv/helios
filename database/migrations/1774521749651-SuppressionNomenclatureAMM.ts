import { MigrationInterface, QueryRunner } from "typeorm";


export class SuppressionNomenclatureAMM1774521749651 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS referentiel_nomenclature_amm;");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.referentiel_nomenclature_amm(
                ref_amm_id BIGSERIAL PRIMARY KEY,
                code_activite character varying(5) NOT NULL,
                libelle_activite character varying(255) NOT NULL,
                code_modalite character varying(5) NOT NULL,
                libelle_modalite character varying(255) NOT NULL,
                code_mention character varying(5) NOT NULL,
                libelle_mention character varying(255) NOT NULL,
                code_pratique_therapeutique_specifique character varying(5) NOT NULL,
                libelle_pratique_therapeutique_specifique character varying(255) NOT NULL,
                code_declaration character varying(5) NOT NULL,
                libelle_declaration character varying(255) NOT NULL
            );`);
  }
}
