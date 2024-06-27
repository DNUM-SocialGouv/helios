import { MigrationInterface, QueryRunner } from "typeorm";

export class AjouterTableBudgetEtFinancesSanitaire1714055066913 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE budget_et_finances_sanitaire (
        annee INT NOT NULL,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
        
        depenses_titre_i_global FLOAT,
        depenses_titre_ii_global FLOAT,
        depenses_titre_iii_global FLOAT,
        depenses_titre_iv_global FLOAT,
        recettes_titre_i_global FLOAT,
        recettes_titre_ii_global FLOAT,
        recettes_titre_iii_global FLOAT,
        recettes_titre_iv_global FLOAT,

        depenses_titre_i_h FLOAT,
        depenses_titre_ii_h FLOAT,
        depenses_titre_iii_h FLOAT,
        depenses_titre_iv_h FLOAT,
        recettes_titre_i_h FLOAT,
        recettes_titre_ii_h FLOAT,
        recettes_titre_iii_h FLOAT,
        
        resultat_net_comptable_san FLOAT,
        taux_de_caf_nette_san FLOAT,
        ratio_dependance_financiere FLOAT,
        
        PRIMARY KEY (annee, numero_finess_etablissement_territorial),

        CONSTRAINT budget_et_finances_sanitaire_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
      );
      `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE budget_et_finances_sanitaire;
      `);
  }
}
