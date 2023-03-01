import { screen } from "@testing-library/react";

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
});
