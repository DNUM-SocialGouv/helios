import { screen } from "@testing-library/react";

import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { BlocBudgetFinance } from "./BlocBudgetFinance";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";

const { wording } = fakeFrontDependencies;

describe("Bloc Budget et Finance", () => {
  it("affiche un l'indicateur vide si il n'y a pas des données", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel([], wording);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.INDICATEURS_VIDES);
    expect(titre).toBeInTheDocument();
  });

  it("affiche un l'indicateur vide si les données sont null", () => {
    // GIVEN
    const budgetFinance: EntitéJuridiqueBudgetFinance[] = [
      {
        année: 2022,
        depensesTitreIGlobal: null,
      } as EntitéJuridiqueBudgetFinance,
    ];
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel(budgetFinance, wording);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} />);

    // THEN
    const titre = screen.getByText(wording.INDICATEURS_VIDES);
    expect(titre).toBeInTheDocument();
  });

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
});
