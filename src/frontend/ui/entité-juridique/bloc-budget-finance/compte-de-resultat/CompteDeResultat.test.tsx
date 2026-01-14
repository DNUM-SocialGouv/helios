import { screen, within, fireEvent } from "@testing-library/react";
import { mock } from "jest-mock-extended";
import React from "react";

import { EntitéJuridiqueBudgetFinance } from "../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { GraphiqueTest } from "../../../../test-helpers/GraphiqueTest";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../../test-helpers/testHelper";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../EntitéJuridiqueBudgetFinanceViewModel";
import { CompteDeResultat } from "./CompteDeResultat";

const { wording } = fakeFrontDependencies;
const etabFiness = "123456789";
const etabTitle = "etabTitle";
let graphiqueTest: GraphiqueTest;

const allocationRessourceMockData = {
  dateMiseÀJourSource: '20/20/2020',
  data: [],
}

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

describe("CompteDeResultat", () => {
  let budgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;

  beforeAll(() => {
    graphiqueTest = new GraphiqueTest(wording);
    budgetFinanceViewModel = new EntitéJuridiqueBudgetFinanceViewModel(
      [
        {
          année: 2022,
          dateMiseÀJourSource: "2022-01-20",
          depensesTitreIGlobal: -101,
          depensesTitreIIGlobal: -200,
          depensesTitreIIIGlobal: -300,
          depensesTitreIVGlobal: -400,
          totalDepensesGlobal: -1001,
          recettesTitreIGlobal: 100,
          recettesTitreIIGlobal: 200,
          recettesTitreIIIGlobal: 300,
          recettesTitreIVGlobal: 400,
          totalRecettesGlobal: 1000,
          depensesTitreIPrincipales: -10,
          depensesTitreIIPrincipales: -20,
          depensesTitreIIIPrincipales: -30,
          depensesTitreIVPrincipales: -50,
          totalDepensesPrincipales: -110,
          recettesTitreIPrincipales: 10,
          recettesTitreIIPrincipales: 20,
          recettesTitreIIIPrincipales: 30,
          totalRecettesPrincipales: 60,
          depensesTitreIAnnexe: -90,
          depensesTitreIIAnnexe: -180,
          depensesTitreIIIAnnexe: -270,
          depensesTitreIVAnnexe: -360,
          totalDepensesAnnexe: -900,
          recettesTitreIAnnexe: 90,
          recettesTitreIIAnnexe: 180,
          recettesTitreIIIAnnexe: 270,
          recettesTitreIVAnnexe: 400,
          totalRecettesAnnexe: 940,
        } as EntitéJuridiqueBudgetFinance,
      ],
      allocationRessourceMockData,
      wording,
      autorisationsMockData
    );
  });

  it("affiche l’intitulé de l’indicateur - Compte de Resultat", () => {
    // WHEN
    renderFakeComponent(<CompteDeResultat className="test" entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

    // THEN
    const titre = graphiqueTest.titre(wording.COMPTE_DE_RÉSULTAT_CF);
    expect(titre).toBeInTheDocument();
  });

  it("affiche la date de mise à jour du fichier ANCRE", () => {
    // WHEN
    renderFakeComponent(<CompteDeResultat className="test" entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

    // THEN
    const dateMiseAJour = graphiqueTest.dateMiseAJour("ANCRE", "20/01/2022");
    expect(dateMiseAJour[0]).toBeInTheDocument();
  });

  describe("Détails info bulle", () => {
    it("affiche le bouton de détail", () => {
      // WHEN
      renderFakeComponent(<CompteDeResultat className="test" entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-budget-et-finances-compte-de-résultat`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it("affiche le contenu de l’info bulle après avoir cliqué sur le bouton 'détails'", () => {
      // GIVEN
      renderFakeComponent(<CompteDeResultat className="test" entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

      // WHEN
      graphiqueTest.ouvreDétail();

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      expect(graphiqueTest.titreDétail(wording.COMPTE_DE_RÉSULTAT_CF)).toBeInTheDocument();
    });

    it("ferme l'info bulle en cliquant sur le bouton 'Fermer'", () => {
      // GIVEN
      renderFakeComponent(<CompteDeResultat className="test" entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);
      graphiqueTest.ouvreDétail();

      // WHEN
      fireEvent.click(screen.getAllByRole("button", { name: wording.FERMER })[0]);

      // THEN
      const détails = graphiqueTest.détail;
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });
  });

  describe("Transcription", () => {
    it("affiche la transcription", () => {
      // WHEN
      renderFakeComponent(<CompteDeResultat className="test" entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

      // THEN
      const transcription = graphiqueTest.boutonAfficherTranscription;
      expect(transcription).toHaveAttribute("aria-expanded", "false");
      expect(transcription).not.toBeDisabled();
    });

    it("affiche le contenu de la transcription", async () => {
      // GIVEN
      renderFakeComponent(<CompteDeResultat className="test" entitéJuridiqueBudgetFinanceViewModel={budgetFinanceViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />);

      // WHEN
      graphiqueTest.afficherLaTranscription();

      // THEN
      const transcription = graphiqueTest.transcriptionTable;
      const transcriptionTable = within(transcription[0]);
      expect(transcriptionTable.getByText(wording.CHARGES_PRINCIPALES)).toBeInTheDocument();
      expect(transcriptionTable.getByText(wording.CHARGES_ANNEXES)).toBeInTheDocument();
      expect(transcriptionTable.getByText(wording.CHARGES)).toBeInTheDocument();
      expect(transcriptionTable.getByText(wording.PRODUITS_PRINCIPAUX)).toBeInTheDocument();
      expect(transcriptionTable.getByText(wording.PRODUITS_ANNEXES)).toBeInTheDocument();
      expect(transcriptionTable.getByText(wording.PRODUITS)).toBeInTheDocument();
      expect(transcriptionTable.getByText("900 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("110 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("1 001 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("940 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("1 000 €")).toBeInTheDocument();
      expect(transcriptionTable.getByText("60 €")).toBeInTheDocument();
    });
  });

  describe("affiche des années", () => {
    it("doit afficher la mise en exergue pour les années manquantes sur les 5 dernières années", () => {
      // GIVEN
      const budgetFinanceVide = new EntitéJuridiqueBudgetFinanceViewModel(
        [mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 2 }), mock<EntitéJuridiqueBudgetFinance>({ année: annéeEnCours - 4 })],
        allocationRessourceMockData,
        wording,
        autorisationsMockData
      );
      // WHEN
      renderFakeComponent(<CompteDeResultat className="test" entitéJuridiqueBudgetFinanceViewModel={budgetFinanceVide} etabFiness={etabFiness} etabTitle={etabTitle} />);

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
        allocationRessourceMockData,
        wording,
        autorisationsMockData
      );
      // WHEN
      renderFakeComponent(<CompteDeResultat className="test" entitéJuridiqueBudgetFinanceViewModel={budgetFinanceAnnees} etabFiness={etabFiness} etabTitle={etabTitle} />);

      // THEN
      const exergue = screen.queryByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE}`, {
        exact: false,
        selector: "p",
      });
      expect(exergue).not.toBeInTheDocument();
    });
  });
});
