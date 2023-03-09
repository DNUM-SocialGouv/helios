import { fireEvent, screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";
import React from "react";

import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../../entité-juridique/bloc-budget-finance/EntitéJuridiqueBudgetFinanceViewModel";
import { ResultatNetComptable } from "./ResultatNetComptable";
import { ResultatNetComptableViewModel } from "./ResultatNetComptableViewModel";

const { wording } = fakeFrontDependencies;

describe("Graphique ResultatNetComptable", () => {
  let graphiqueTest: GraphiqueTest;
  let viewModel: ResultatNetComptableViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    viewModel = new ResultatNetComptableViewModel([]);
  });

  it("affiche abréviation du fichier source pour un EJ", () => {
    // WHEN
    renderFakeComponent(<ResultatNetComptable estEntitéJuridique={true} resultatNetComptableViewModel={viewModel} />);

    // THEN
    const ancre = graphiqueTest.abréviationFichierSource("ANCRE");
    expect(ancre).toBeInTheDocument();
    expect(ancre).toHaveAttribute("title", wording.ANCRE_TITLE);
  });

  it("affiche abréviation du fichier source pour un ET", () => {
    // WHEN
    renderFakeComponent(<ResultatNetComptable resultatNetComptableViewModel={viewModel} />);

    // THEN
    const cnsa = graphiqueTest.abréviationFichierSource("CNSA");
    expect(cnsa).toBeInTheDocument();
    expect(cnsa).toHaveAttribute("title", wording.CNSA_TITLE);
  });

  describe("Détails info bulle", () => {
    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<ResultatNetComptable estEntitéJuridique={true} resultatNetComptableViewModel={viewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-budget-et-finances-résultat-net-comptable`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu pour de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<ResultatNetComptable estEntitéJuridique={true} resultatNetComptableViewModel={viewModel} />);

      // WHEN
      const détails = graphiqueTest.détail;
      graphiqueTest.ouvreDétail();

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.RÉSULTAT_NET_COMPTABLE);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<ResultatNetComptable estEntitéJuridique={true} resultatNetComptableViewModel={viewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      // TODO regard why we cant use fermeDetail
      // graphiqueTest.fermeDétail();
      const fermer = screen.getAllByRole("button", { name: wording.FERMER })[0];
      fireEvent.click(fermer);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("affiche des années", () => {
    it("doit afficher la mise en exergue pour les années manquantes sur les 5 dernières années", () => {
      // GIVEN
      const budgetFinanceVide = new EntitéJuridiqueBudgetFinanceViewModel(
        [mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 2 }), mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 4 })],
        wording
      );
      // WHEN
      renderFakeComponent(<ResultatNetComptable resultatNetComptableViewModel={budgetFinanceVide.resultatNetComptable} />);

      // THEN
      const exergue = screen.getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 3}, ${annéeEnCours - 1}`, { selector: "p" });
      expect(exergue).toBeInTheDocument();
    });

    it("ne doit pas afficher la mise en exergue si toutes les années sont présentes", () => {
      // GIVEN
      const budgetFinanceAnnees = new EntitéJuridiqueBudgetFinanceViewModel(
        [
          mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 1 }),
          mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 2 }),
          mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 3 }),
          mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 4 }),
          mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 5 }),
        ],
        wording
      );
      // WHEN
      renderFakeComponent(<ResultatNetComptable resultatNetComptableViewModel={budgetFinanceAnnees.resultatNetComptable} />);

      // THEN
      const exergue = screen.queryByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE}`, {
        exact: false,
        selector: "p",
      });
      expect(exergue).not.toBeInTheDocument();
    });
  });
});
