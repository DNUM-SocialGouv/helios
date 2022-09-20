class AjoutBudgetEtFinancesMédicoSocial1663593231271 {
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE cadre_budgetaire AS ENUM
        ('ERRD', 'CA_PA', 'CA_PF');
        CREATE TABLE budget_et_finances_medico_social (
        annee INT NOT NULL,
        numero_finess_etablissement_territorial VARCHAR(9) NOT NULL,
        contribution_frais_de_siege_groupement FLOAT,
        depenses_groupe_i FLOAT,
        depenses_groupe_ii FLOAT,
        depenses_groupe_iii FLOAT,
        recettes_groupe_i FLOAT,
        recettes_groupe_ii FLOAT,
        recettes_groupe_iii FLOAT,
        resultat_net_comptable FLOAT,
        produits FLOAT,
        charges FLOAT,
        cadre_budgetaire cadre_budgetaire

        PRIMARY KEY (annee, numero_finess_etablissement_territorial),

        CONSTRAINT budget_et_finances_medico_social_etablissement_territorial_finess_foreign_key
          FOREIGN KEY (numero_finess_etablissement_territorial)
            REFERENCES etablissement_territorial (numero_finess_etablissement_territorial)
            ON DELETE CASCADE
        );`
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP TABLE budget_et_finances_medico_social;
       DROP TYPE cadre_budgetaire;
       `
    )
  }
}

module.exports = AjoutBudgetEtFinancesMédicoSocial1663593231271
