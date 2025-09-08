import { screen, within } from "@testing-library/react";
import { mock } from "jest-mock-extended";
import React from "react";

import { RatioDependanceFinanciere } from "./RatioDependanceFinanciere";
import { RatioDependanceFinanciereViewModel } from "./RatioDependanceFinanciereViewModel";
import { EntitéJuridiqueBudgetFinance } from "../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { GraphiqueTest } from "../../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;

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

describe("RatioDependanceFinanciere", () => {
  let graphiqueTest: GraphiqueTest;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
  });

  it("affiche abréviation du fichier source", () => {
    // GIVEN
    const viewModel = new RatioDependanceFinanciereViewModel([
      mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 1, ratioDependanceFinanciere: 0.1, dateMiseÀJourSource: "20/20/2022" }),
    ], autorisationsMockData);

    // WHEN
    renderFakeComponent(<RatioDependanceFinanciere ratioDependanceFinanciereViewModel={viewModel} />);

    // THEN
    const fichierSource = graphiqueTest.abréviationFichierSource("ANCRE");
    expect(fichierSource).toBeInTheDocument();
    expect(fichierSource).toHaveAttribute("title", wording.ANCRE_TITLE);
  });

  describe("Détails info bulle", () => {
    let viewModel: RatioDependanceFinanciereViewModel;

    beforeAll(() => {
      // GIVEN
      viewModel = new RatioDependanceFinanciereViewModel([
        mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 1, ratioDependanceFinanciere: 0.1, dateMiseÀJourSource: "20/20/2022" }),
      ], autorisationsMockData);
    });

    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<RatioDependanceFinanciere ratioDependanceFinanciereViewModel={viewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-budget-et-finances-ratio-dependance-financiere`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<RatioDependanceFinanciere ratioDependanceFinanciereViewModel={viewModel} />);

      // WHEN
      const détails = graphiqueTest.détail;
      graphiqueTest.ouvreDétail();

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const h1 = graphiqueTest.titreDétail(wording.RATIO_DEPENDANCE_FINANCIERE);
      expect(h1).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<RatioDependanceFinanciere ratioDependanceFinanciereViewModel={viewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      graphiqueTest.fermeDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("pas de ratio renseignés", () => {
    let viewModel: RatioDependanceFinanciereViewModel;

    beforeEach(() => {
      // GIVEN
      viewModel = new RatioDependanceFinanciereViewModel([], autorisationsMockData);
    });

    it("le graphique n'est pas affiché", () => {
      // WHEN
      renderFakeComponent(<RatioDependanceFinanciere ratioDependanceFinanciereViewModel={viewModel} />);
      // THEN
      const titre = graphiqueTest.titre(wording.RATIO_DEPENDANCE_FINANCIERE);
      expect(titre).not.toBeInTheDocument();
    });
  });

  describe("ratio dépendance financière renseignés", () => {
    let viewModel: RatioDependanceFinanciereViewModel;

    beforeAll(() => {
      viewModel = new RatioDependanceFinanciereViewModel([
        mock<EntitéJuridiqueBudgetFinance>({
          année: annéeEnCours - 1,
          ratioDependanceFinanciere: 0.1,
          dateMiseÀJourSource: "2020-10-01",
        }),
      ], autorisationsMockData);
    });

    it("affiche la date de mise à jour du fichier ANCRE", () => {
      // WHEN
      renderFakeComponent(<RatioDependanceFinanciere ratioDependanceFinanciereViewModel={viewModel} />);

      // THEN
      const dateMiseAJour = graphiqueTest.dateMiseAJour("ANCRE", "01/10/2020");
      expect(dateMiseAJour[0]).toBeInTheDocument();
    });

    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<RatioDependanceFinanciere ratioDependanceFinanciereViewModel={viewModel} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", () => {
      // GIVEN
      renderFakeComponent(<RatioDependanceFinanciere ratioDependanceFinanciereViewModel={viewModel} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
      const transcriptionTable = within(transcription);
      expect(transcriptionTable.getByText(annéeEnCours - 1)).toBeInTheDocument();
      expect(transcriptionTable.getByText("10 %")).toBeInTheDocument();
    });

    it("affiche la mise en exergue pour les années manquantes", () => {
      // WHEN
      renderFakeComponent(<RatioDependanceFinanciere ratioDependanceFinanciereViewModel={viewModel} />);

      // THEN
      const exergue = screen.getByText(
        `${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 3}, ${annéeEnCours - 2}`,
        { selector: "p" }
      );
      expect(exergue).toBeInTheDocument();
    });
  });
});
