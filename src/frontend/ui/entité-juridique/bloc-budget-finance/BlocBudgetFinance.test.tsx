import { screen } from "@testing-library/react";

import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { BlocBudgetFinance } from "./BlocBudgetFinance";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";

const { wording } = fakeFrontDependencies;

describe("Bloc Budget et Finance", () => {
  it("affiche l'indicateur compte de résultat s'il y a des données", () => {
    // GIVEN
    const budgetFinance: EntitéJuridiqueBudgetFinance[] = [
      {
        année: 2022,
        depensesTitreIGlobal: 100,
      } as EntitéJuridiqueBudgetFinance,
    ];
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel(budgetFinance, wording);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} />);

    // THEN
    const titre = screen.getAllByText(wording.COMPTE_DE_RÉSULTAT);
    expect(titre).not.toHaveLength(0);
  });

  it("affiche l'indicateur resultat net comptable s'il y a des données", () => {
    // GIVEN
    const budgetFinance: EntitéJuridiqueBudgetFinance[] = [
      {
        année: 2022,
        resultatNetComptable: 100,
      } as EntitéJuridiqueBudgetFinance,
    ];
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel(budgetFinance, wording);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} />);

    // THEN
    const titre = screen.getAllByText(wording.RÉSULTAT_NET_COMPTABLE);
    expect(titre).not.toHaveLength(0);
  });

  it("affiche l'indicateur ratio dépendance financière s'il y a de la données", () => {
    // GIVEN
    const budgetFinance: EntitéJuridiqueBudgetFinance[] = [
      {
        année: 2022,
        ratioDependanceFinanciere: 0.5,
      } as EntitéJuridiqueBudgetFinance,
    ];
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel(budgetFinance, wording);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} />);

    // THEN
    const titre = screen.getAllByText(wording.RATIO_DEPENDANCE_FINANCIERE);
    expect(titre).not.toHaveLength(0);
  });

  it("affiche l'indicateur taux de caf nette s'il y a de la données", () => {
    // GIVEN
    const budgetFinance: EntitéJuridiqueBudgetFinance[] = [
      {
        année: 2022,
        tauxDeCafNetSan: 0.5,
      } as EntitéJuridiqueBudgetFinance,
    ];
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel(budgetFinance, wording);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} />);

    // THEN
    const titre = screen.getAllByText(wording.TAUX_DE_CAF);
    expect(titre).not.toHaveLength(0);
  });
});
