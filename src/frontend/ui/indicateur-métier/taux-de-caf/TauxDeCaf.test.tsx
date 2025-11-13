import { screen, within } from "@testing-library/react";
import React from "react";

import { TauxDeCaf } from "./TauxDeCaf";
import { TauxDeCafViewModel } from "./TauxDeCafViewModel";
import { GraphiqueTest } from "../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;
const etabFiness = "123456789";
const etabTitle = "etabTitle";
let graphiqueTest: GraphiqueTest;

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

describe("Taux de CAF", () => {
  let tauxDeCafViewModel: TauxDeCafViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    tauxDeCafViewModel = new TauxDeCafViewModel(
      [
        { année: annéeEnCours - 2, valeur: 0.1 },
        { année: annéeEnCours - 1, valeur: 0.5 },
      ],
      "10-22-2023",
      autorisationsMockData,
      wording
    );
  });

  it("affiche l’intitulé de l’indicateur - Taux de caf nette", () => {
    // WHEN
    renderFakeComponent(<TauxDeCaf etabFiness={etabFiness} etabTitle={etabTitle} tauxDeCafViewModel={tauxDeCafViewModel} />);

    // THEN
    const titre = graphiqueTest.titre(wording.TAUX_DE_CAF);
    expect(titre).toBeInTheDocument();
  });

  it("affiche la date de mise à jour du fichier CNSA", () => {
    // WHEN
    renderFakeComponent(<TauxDeCaf etabFiness={etabFiness} etabTitle={etabTitle} tauxDeCafViewModel={tauxDeCafViewModel} />);

    // THEN
    const dateMiseAJour = graphiqueTest.dateMiseAJour("CNSA", "22/10/2023");
    expect(dateMiseAJour[0]).toBeInTheDocument();
  });

  describe("Détails info bulle", () => {
    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<TauxDeCaf etabFiness={etabFiness} etabTitle={etabTitle} tauxDeCafViewModel={tauxDeCafViewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-budget-et-finances-taux-de-caf`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<TauxDeCaf etabFiness={etabFiness} etabTitle={etabTitle} tauxDeCafViewModel={tauxDeCafViewModel} />);

      // WHEN
      graphiqueTest.ouvreDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      expect(graphiqueTest.titreDétail(wording.TAUX_DE_CAF)).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<TauxDeCaf etabFiness={etabFiness} etabTitle={etabTitle} tauxDeCafViewModel={tauxDeCafViewModel} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      graphiqueTest.fermeDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("Transcription", () => {
    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<TauxDeCaf etabFiness={etabFiness} etabTitle={etabTitle} tauxDeCafViewModel={tauxDeCafViewModel} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", async () => {
      // GIVEN
      renderFakeComponent(<TauxDeCaf etabFiness={etabFiness} etabTitle={etabTitle} tauxDeCafViewModel={tauxDeCafViewModel} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
      const transcriptionTable = within(transcription[0]);
      expect(transcriptionTable.getByText(wording.ANNÉE)).toBeInTheDocument();
      expect(transcriptionTable.getByText(wording.TAUX_DE_CAF)).toBeInTheDocument();
      expect(transcriptionTable.getByText(annéeEnCours - 2)).toBeInTheDocument();
      expect(transcriptionTable.getByText("10 %")).toBeInTheDocument();
      expect(transcriptionTable.getByText(annéeEnCours - 1)).toBeInTheDocument();
      expect(transcriptionTable.getByText("50 %")).toBeInTheDocument();
    });
  });

  describe("affiche des années", () => {
    it("doit afficher la mise en exergue pour les années manquantes sur les 3 dernières années", () => {
      // GIVEN
      const budgetFinanceVide = new TauxDeCafViewModel([{ année: annéeEnCours - 2, valeur: 0.1 }], "22-10-2023", autorisationsMockData, wording, 3);
      // WHEN
      renderFakeComponent(<TauxDeCaf etabFiness={etabFiness} etabTitle={etabTitle} tauxDeCafViewModel={budgetFinanceVide} />);

      // THEN
      const exergue = screen.getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 3}, ${annéeEnCours - 1}`, { selector: "p" });
      expect(exergue).toBeInTheDocument();
    });

    it("ne doit pas afficher la mise en exergue si toutes les années sont présentes", () => {
      // GIVEN
      const budgetFinanceAnnees = new TauxDeCafViewModel(
        [
          { année: annéeEnCours - 1, valeur: 0.1 },
          { année: annéeEnCours - 2, valeur: 0.2 },
          { année: annéeEnCours - 3, valeur: 0.3 },
        ],
        "22-10-2022",
        autorisationsMockData,
        wording,
        3
      );
      // WHEN
      renderFakeComponent(<TauxDeCaf etabFiness={etabFiness} etabTitle={etabTitle} tauxDeCafViewModel={budgetFinanceAnnees} />);

      // THEN
      const exergue = screen.queryByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE}`, {
        exact: false,
        selector: "p",
      });
      expect(exergue).not.toBeInTheDocument();
    });
  });
});
