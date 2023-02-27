import { MigrationInterface, QueryRunner } from "typeorm";

export class AjouterBlocBudgetFinanceEJ1677495763184 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE budget_et_finances_entite_juridique (
        annee INT NOT NULL,
        numero_finess_entite_juridique VARCHAR(9) NOT NULL,
        
        depenses_titre_i_budget_global FLOAT,
        depenses_titre_ii_budget_global FLOAT,
        depenses_titre_iii_budget_global FLOAT,
        depenses_titre_iv_budget_global FLOAT,
        recettes_titre_i_budget_global FLOAT,
        recettes_titre_ii_budget_global FLOAT,
        recettes_titre_iii_budget_global FLOAT,
        recettes_titre_iv_budget_global FLOAT,

        depenses_titre_i_budget_h FLOAT,
        depenses_titre_ii_budget_h FLOAT,
        depenses_titre_iii_budget_h FLOAT,
        depenses_titre_iv_budget_h FLOAT,
        recettes_titre_i_budget_h FLOAT,
        recettes_titre_ii_budget_h FLOAT,
        recettes_titre_iii_budget_h FLOAT,
        
        resultat_net_comptable_san FLOAT,
        taux_de_caf_nette_san FLOAT,
        ratio_dependance_financiere FLOAT,
        
        PRIMARY KEY (annee, numero_finess_entite_juridique),

        CONSTRAINT budget_et_finances_entite_juridique_finess_foreign_key
          FOREIGN KEY (numero_finess_entite_juridique)
            REFERENCES entite_juridique (numero_finess_entite_juridique)
            ON DELETE CASCADE
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE budget_et_finances_entite_juridique;
    `);
  }
}
