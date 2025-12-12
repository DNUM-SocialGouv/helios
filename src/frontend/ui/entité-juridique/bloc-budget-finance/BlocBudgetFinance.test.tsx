import { screen } from "@testing-library/react";

import { BlocBudgetFinance } from "./BlocBudgetFinance";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";
import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;
const etabFiness = "123456789";
const etabTitle = "etabTitle";

const allocationRessourceMockData = {
  dateMiseÀJourSource: "20/20/2020",
  data: [],
};
const autorisationsMockData = {
  budgetEtFinance: {
    tauxDeCafNette: "ok",
    compteRésultats: "ok",
    résultatNetComptable: "ok",
    ratioDépendanceFinancière: "ok",
    allocationDeRessources: "ok",
  },
  budgetEtFinances: {
    tauxDeCafNette: "ok",
    compteRésultats: "ok",
    fondsDeRoulement: "ok",
    résultatNetComptable: "ok",
    tauxDeVétustéConstruction: "ok",
    contributionAuxFraisDeSiège: "ok",
  },
};

describe("Bloc Budget et Finance", () => {
  it("affiche un l'indicateur vide si il n'y a pas des données", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel([], allocationRessourceMockData, wording, autorisationsMockData);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} etabFiness={etabFiness} etabTitle={etabTitle} type="EJ" />);

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
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel(budgetFinance, allocationRessourceMockData, wording, autorisationsMockData);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} etabFiness={etabFiness} etabTitle={etabTitle} type="EJ" />);

    // THEN
    const titre = screen.getAllByText(wording.COMPTE_DE_RÉSULTAT_CF);
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
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel(budgetFinance, allocationRessourceMockData, wording, autorisationsMockData);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} etabFiness={etabFiness} etabTitle={etabTitle} type="EJ" />);

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
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel(budgetFinance, allocationRessourceMockData, wording, autorisationsMockData);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} etabFiness={etabFiness} etabTitle={etabTitle} type="EJ" />);

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
    const viewModel = new EntitéJuridiqueBudgetFinanceViewModel(budgetFinance, allocationRessourceMockData, wording, autorisationsMockData);

    // WHEN
    renderFakeComponent(<BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={viewModel} etabFiness={etabFiness} etabTitle={etabTitle} type="EJ" />);

    // THEN
    const titre = screen.getAllByText(wording.TAUX_DE_CAF);
    expect(titre).not.toHaveLength(0);
  });
});
