import { screen, within } from "@testing-library/react";
import React from "react";

import { GraphiqueTest } from "../../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../../test-helpers/testHelper";
import { TauxDeCaf } from "./TauxDeCaf";
import { TauxDeCafViewModel } from "./TauxDeCafViewModel";

const { wording } = fakeFrontDependencies;
let graphiqueTest: GraphiqueTest;

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
      wording
    );
  });

  it("affiche l’intitulé de l’indicateur - Taux de caf nette", () => {
    // WHEN
    renderFakeComponent(<TauxDeCaf tauxDeCafViewModel={tauxDeCafViewModel} />);

    // THEN
    const titre = graphiqueTest.titre(wording.TAUX_DE_CAF);
    expect(titre).toBeInTheDocument();
  });

  it("affiche la date de mise à jour du fichier CNSA", () => {
    // WHEN
    renderFakeComponent(<TauxDeCaf tauxDeCafViewModel={tauxDeCafViewModel} />);

    // THEN
    const dateMiseAJour = graphiqueTest.dateMiseAJour("CNSA", "22/10/2023");
    expect(dateMiseAJour[0]).toBeInTheDocument();
  });

  describe("Détails info bulle", () => {
    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<TauxDeCaf tauxDeCafViewModel={tauxDeCafViewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-budget-et-finances-taux-de-caf`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<TauxDeCaf tauxDeCafViewModel={tauxDeCafViewModel} />);

      // WHEN
      graphiqueTest.ouvreDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      expect(graphiqueTest.titreDétail(wording.TAUX_DE_CAF)).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<TauxDeCaf tauxDeCafViewModel={tauxDeCafViewModel} />);
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
      renderFakeComponent(<TauxDeCaf tauxDeCafViewModel={tauxDeCafViewModel} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", async () => {
      // GIVEN
      renderFakeComponent(<TauxDeCaf tauxDeCafViewModel={tauxDeCafViewModel} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
      const transcriptionTable = within(transcription);
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
      const budgetFinanceVide = new TauxDeCafViewModel([{ année: annéeEnCours - 2, valeur: 0.1 }], "22-10-2023", wording);
      // WHEN
      renderFakeComponent(<TauxDeCaf tauxDeCafViewModel={budgetFinanceVide} />);

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
        wording
      );
      // WHEN
      renderFakeComponent(<TauxDeCaf tauxDeCafViewModel={budgetFinanceAnnees} />);

      // THEN
      const exergue = screen.queryByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE}`, {
        exact: false,
        selector: "p",
      });
      expect(exergue).not.toBeInTheDocument();
    });
  });
});
