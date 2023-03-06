import { within } from "@testing-library/react";
import React from "react";

import { EntitéJuridiqueBudgetFinance } from "../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { GraphiqueTest } from "../../../../test-helpers/GraphiqueTest";
import { fakeFrontDependencies, renderFakeComponent } from "../../../../test-helpers/testHelper";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../EntitéJuridiqueBudgetFinanceViewModel";
import { CompteDeResultat } from "./CompteDeResultat";

const { wording } = fakeFrontDependencies;
let graphiqueTest: GraphiqueTest;

/* Liste des tests à réalisé :
 * - Gestion des années :
 *      - On voit une liste avec les 5 dernières années disponible dans l'ordre
 *      - Mise en exergue : si il manque des années la liste des années manquantes est affichée
 *      - Si on change d'année les données dans la transcription doivent changer
 * - Transcription :
 *    - Vérifier le contenu de la transcription (Not done for everything only a handful of columms)
 * */

describe("CompteDeResultat", () => {
  let budgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    budgetFinanceViewModel = new EntitéJuridiqueBudgetFinanceViewModel(
      [
        {
          année: 2022,
          dateMiseÀJourSource: "2022-01-20",
          depensesTitreIGlobal: -100,
          depensesTitreIIGlobal: -200,
          depensesTitreIIIGlobal: -300,
          depensesTitreIVGlobal: -400,
          totalDepensesGlobal: -1000,
          recettesTitreIGlobal: 100,
          recettesTitreIIGlobal: 200,
          recettesTitreIIIGlobal: 300,
          recettesTitreIVGlobal: 400,
          totalRecettesGlobal: 1000,
          depensesTitreIH: -10,
          depensesTitreIIH: -20,
          depensesTitreIIIH: -30,
          depensesTitreIVH: -50,
          totalDepensesH: -110,
          recettesTitreIH: 10,
          recettesTitreIIH: 20,
          recettesTitreIIIH: 30,
          totalRecettesH: 60,
          depensesTitreIPrincipale: -90,
          depensesTitreIIPrincipale: -180,
          depensesTitreIIIPrincipale: -270,
          depensesTitreIVPrincipale: -360,
          totalDepensesPrincipale: -900,
          recettesTitreIPrincipale: 90,
          recettesTitreIIPrincipale: 180,
          recettesTitreIIIPrincipale: 270,
          recettesTitreIVPrincipale: 400,
          totalRecettesPrincipale: 940,
        } as EntitéJuridiqueBudgetFinance,
      ],
      wording
    );
  });

  it("affiche l’intitulé de l’indicateur - Compte de Resultat", () => {
    // WHEN
    renderFakeComponent(<CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} />);

    // THEN
    const titre = graphiqueTest.titre(wording.COMPTE_DE_RÉSULTAT);
    expect(titre).toBeInTheDocument();
  });

  it("affiche la date de mise à jour du fichier ANCRE", () => {
    // WHEN
    renderFakeComponent(<CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} />);

    // THEN
    const dateMiseAJour = graphiqueTest.dateMiseAJour("ANCRE", "20/01/2022");
    expect(dateMiseAJour[0]).toBeInTheDocument();
  });

  describe("Détails info bulle", () => {
    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-budget-et-finances-compte-de-résultat`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} />);

      // WHEN
      graphiqueTest.ouvreDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      expect(graphiqueTest.titreDétail(wording.COMPTE_DE_RÉSULTAT)).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} />);
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
      renderFakeComponent(<CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", async () => {
      // GIVEN
      renderFakeComponent(<CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
      const transcriptionTable = within(transcription);
      expect(transcriptionTable.getByText("Charges Principales")).toBeInTheDocument();
      expect(transcriptionTable.getByText("Charges Annexes")).toBeInTheDocument();
      expect(transcriptionTable.getByText("Charges Totales")).toBeInTheDocument();
      expect(transcriptionTable.getByText("Produits Principals")).toBeInTheDocument();
      expect(transcriptionTable.getByText("Produits Annexes")).toBeInTheDocument();
      expect(transcriptionTable.getByText("Produits Totals")).toBeInTheDocument();
      expect(transcriptionTable.getByText("−900 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("−110 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("−1 000 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("940 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("1 000 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("60 €")).toBeInTheDocument();
    });
  });
});
