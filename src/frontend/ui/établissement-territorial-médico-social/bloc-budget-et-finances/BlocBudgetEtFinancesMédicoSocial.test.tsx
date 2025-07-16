import { fireEvent, screen, within } from "@testing-library/react";

import { BlocBudgetEtFinancesMédicoSocial } from "./BlocBudgetEtFinancesMédicoSocial";
import { ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel } from "./ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from "../../../test-helpers/test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder";
import { textMatch, fakeFrontDependencies, renderFakeComponent, annéeEnCours } from "../../../test-helpers/testHelper";

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

describe("La page établissement territorial - bloc budget et finances", () => {
  const budgetFinanceViewModel = new ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel(
    ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.budgetEtFinances,
    wording,
    autorisationsMockData
  );
  const indiceDeLIndicateur: Record<keyof ÉtablissementTerritorialMédicoSocialBudgetEtFinances, number> = {
    année: -1,
    cadreBudgétaire: -1,
    chargesEtProduits: -1,
    contributionAuxFraisDeSiège: 5,
    fondsDeRoulement: 8,
    recettesEtDépenses: 0,
    résultatNetComptable: 4,
    tauxDeCafNette: 6,
    tauxDeVétustéConstruction: 7,
  };

  it.each([
    [indiceDeLIndicateur.recettesEtDépenses, wording.COMPTE_DE_RÉSULTAT_ERRD, "budget-et-finances-compte-de-résultat"],
    [indiceDeLIndicateur.résultatNetComptable, wording.RÉSULTAT_NET_COMPTABLE, "budget-et-finances-résultat-net-comptable"],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège, wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE, "budget-et-finances-montant-de-la-contribution"],
    [indiceDeLIndicateur.tauxDeCafNette, wording.TAUX_DE_CAF, "budget-et-finances-taux-de-caf"],
    [indiceDeLIndicateur.tauxDeVétustéConstruction, wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION, "budget-et-finances-taux-de-vétusté-construction"],
    [indiceDeLIndicateur.fondsDeRoulement, wording.FONDS_DE_ROULEMENT_NET_GLOBAL, "budget-et-finances-fond-de-roulement-net-global"],
  ])(
    "affiche l’intitulé de l’indicateur %s, avec sa date de mise à jour, ses sources et un bouton pour accéder aux détails",
    (indiceDeLIndicateur, libelléDeLIndicateur, identifiantInfoBulle) => {
      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur];
      const titre = within(indicateur).getByText(libelléDeLIndicateur, { selector: "h3" });

      expect(titre).toBeInTheDocument();
      const dateMiseAJour = within(indicateur).getAllByText(textMatch(`${wording.miseÀJour("01/01/2022")} - Source : CNSA`), { selector: "p" });
      expect(dateMiseAJour[0]).toBeInTheDocument();
      const abréviationSourceOrigine = within(indicateur).getAllByText("CNSA", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.CNSA_TITLE);
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", `nom-info-bulle-${identifiantInfoBulle}`);
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    }
  );

  it.each([
    [indiceDeLIndicateur.recettesEtDépenses, wording.COMPTE_DE_RÉSULTAT_ERRD],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège, wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE],
    [indiceDeLIndicateur.tauxDeCafNette, wording.TAUX_DE_CAF],
    [indiceDeLIndicateur.tauxDeVétustéConstruction, wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION],
    [indiceDeLIndicateur.fondsDeRoulement, wording.FONDS_DE_ROULEMENT_NET_GLOBAL],
  ])('affiche le contenu de l’info bulle %s après avoir cliqué sur le bouton "détails"', (indiceDeLIndicateur, libelléDeLIndicateur) => {
    // GIVEN
    renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);
    const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
    const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
    const indicateur = indicateurs[indiceDeLIndicateur];
    const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

    // WHEN
    fireEvent.click(détails);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "true");
    const infoBulle = screen.getByRole("dialog", { name: libelléDeLIndicateur });
    const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
    expect(fermer).toBeInTheDocument();
    const abréviationSourceOrigine = within(infoBulle).getAllByText("CNSA", { selector: "abbr" });
    expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.CNSA_TITLE);
    const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
    expect(élémentsDeCompréhension).toBeInTheDocument();
    const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
    expect(fréquence).toBeInTheDocument();
    const modeDeCalcul = within(infoBulle).getByRole("region", { name: wording.MODE_DE_CALCUL });
    expect(modeDeCalcul).toBeInTheDocument();
    const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
    expect(sources).toBeInTheDocument();
  });

  it.each([
    [indiceDeLIndicateur.recettesEtDépenses, wording.COMPTE_DE_RÉSULTAT_ERRD],
    [indiceDeLIndicateur.résultatNetComptable, wording.RÉSULTAT_NET_COMPTABLE],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège, wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE],
    [indiceDeLIndicateur.tauxDeCafNette, wording.TAUX_DE_CAF],
    [indiceDeLIndicateur.tauxDeVétustéConstruction, wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION],
    [indiceDeLIndicateur.fondsDeRoulement, wording.FONDS_DE_ROULEMENT_NET_GLOBAL],
  ])('ferme l’info bulle %s après avoir cliqué sur le bouton "Fermer"', (indiceDeLIndicateur, libelléDeLIndicateur) => {
    // GIVEN
    renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);
    const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
    const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
    const indicateur = indicateurs[indiceDeLIndicateur];
    const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
    fireEvent.click(détails);
    const infoBulle = screen.getByRole("dialog", { name: libelléDeLIndicateur });
    const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });

    // WHEN
    fireEvent.click(fermer);

    // THEN
    expect(détails).toHaveAttribute("data-fr-opened", "false");
  });

  it.each([
    [indiceDeLIndicateur.recettesEtDépenses],
    [indiceDeLIndicateur.résultatNetComptable],
    [indiceDeLIndicateur.contributionAuxFraisDeSiège],
    [indiceDeLIndicateur.tauxDeCafNette],
    [indiceDeLIndicateur.tauxDeVétustéConstruction],
    // [indiceDeLIndicateur.fondsDeRoulement],
  ])("affiche une mise en exergue si une ou plusieurs années sont manquantes", (indiceDeLIndicateur) => {
    // GIVEN
    const budgetFinanceViewModel = new ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel(
      [
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa({ année: annéeEnCours - 3 }),
        ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: annéeEnCours - 2 }),
      ],
      wording,
      autorisationsMockData
    );

    // WHEN
    renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

    // THEN
    const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
    const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
    const indicateur = indicateurs[indiceDeLIndicateur];
    const exergue = within(indicateur).getByText(`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéeEnCours - 5}, ${annéeEnCours - 4}, ${annéeEnCours - 1}`, { selector: "p" });
    expect(exergue).toBeInTheDocument();
  });

  describe("L’indicateur de compte de résultat", () => {
    it("affiche les années dans une liste des tags par ordre chronologique quand le budget et finances est ERRD", () => {
      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const recettesEtDépenses = indicateurs[indiceDeLIndicateur.recettesEtDépenses];
      const années = within(recettesEtDépenses).getAllByTestId("groupe-annees");
      expect(années[0].textContent).toBe("2020");
      expect(années[1].textContent).toBe("2021");
      expect(années[2].textContent).toBe("2022");
    });

    it("affiche un tableau descriptif sur la dernière année qui est ERRD", () => {
      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const recettesEtDépenses = indicateurs[indiceDeLIndicateur.recettesEtDépenses];
      const tableau = within(recettesEtDépenses).getByRole("table");
      const titreBudgétaire = within(tableau).getByRole("columnheader", { name: wording.COMPTE_DE_RÉSULTAT_ERRD });
      expect(titreBudgétaire).toBeInTheDocument();
      const dépensesLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.DÉPENSES });
      expect(dépensesLigneDEnTête).toBeInTheDocument();
      const recettesLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.RECETTES });
      expect(recettesLigneDEnTête).toBeInTheDocument();

      const titresBudgétairesEtDépensesEtRecettes = [
        {
          dépense: "1 392 795 €",
          recette: "1 400 085 €",
          titreBudgétaire: wording.TOTAL,
        },
        {
          dépense: "161 786 €",
          recette: "1 376 745 €",
          titreBudgétaire: wording.GROUPE_I,
        },
        {
          dépense: "1 222 577 €",
          recette: "23 340 €",
          titreBudgétaire: wording.GROUPE_II,
        },
        {
          dépense: "8 433 €",
          recette: "0 €",
          titreBudgétaire: wording.GROUPE_III,
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      titresBudgétairesEtDépensesEtRecettes.forEach((titreBudgétaireEtDépenseEtRecette, index) => {
        const titreBudgétaire = within(lignes[index]).getByRole("cell", { name: titreBudgétaireEtDépenseEtRecette.titreBudgétaire });
        expect(titreBudgétaire).toBeInTheDocument();
        const dépense = within(lignes[index]).getByRole("cell", { name: titreBudgétaireEtDépenseEtRecette.dépense });
        expect(dépense).toBeInTheDocument();
        const recette = within(lignes[index]).getByRole("cell", { name: titreBudgétaireEtDépenseEtRecette.recette });
        expect(recette).toBeInTheDocument();
      });
    });

    it("affiche un tableau descriptif sur la dernière année qui est CA", () => {
      // GIVEN
      const budgetFinanceViewModel = new ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel(
        [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa()],
        wording,
        autorisationsMockData
      );

      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const recettesEtDépenses = indicateurs[indiceDeLIndicateur.recettesEtDépenses];
      const tableau = within(recettesEtDépenses).getByRole("table");
      const dépensesLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.CHARGES });
      expect(dépensesLigneDEnTête).toBeInTheDocument();
      const recettesLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.PRODUITS });
      expect(recettesLigneDEnTête).toBeInTheDocument();

      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      const colonne1Ligne1 = within(lignes[0]).getByRole("cell", { name: wording.TOTAL });
      expect(colonne1Ligne1).toBeInTheDocument();
      const colonne2Ligne1 = within(lignes[0]).getByRole("cell", { name: "1 613 142 €" });
      expect(colonne2Ligne1).toBeInTheDocument();
      const colonne3Ligne1 = within(lignes[0]).getByRole("cell", { name: "1 633 422 €" });
      expect(colonne3Ligne1).toBeInTheDocument();
    });

    it("affiche un tableau descriptif en fonction de l’année sélectionnée", () => {
      // GIVEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const recettesEtDépenses = indicateurs[indiceDeLIndicateur.recettesEtDépenses];
      const année = within(recettesEtDépenses).getByRole("button", { name: "2022" });

      // WHEN
      fireEvent.click(année);

      // THEN
      const tableau = within(recettesEtDépenses).getByRole("table");

      const dépensesEtRecettes = [
        {
          dépense: "1 392 795 €",
          recette: "1 400 085 €",
        },
        {
          dépense: "161 786 €",
          recette: "1 376 745 €",
        },
        {
          dépense: "1 222 577 €",
          recette: "23 340 €",
        },
        {
          dépense: "8 433 €",
          recette: "0 €",
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      dépensesEtRecettes.forEach((dépenseEtRecette, index) => {
        const dépense = within(lignes[index]).getByRole("cell", { name: dépenseEtRecette.dépense });
        expect(dépense).toBeInTheDocument();
        const recette = within(lignes[index]).getByRole("cell", { name: dépenseEtRecette.recette });
        expect(recette).toBeInTheDocument();
      });
    });
  });

  describe("L’indicateur du résultat net comptable", () => {
    it("affiche un tableau affichant les 3 années passées", () => {
      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const résultatNetComptable = indicateurs[indiceDeLIndicateur.résultatNetComptable];
      const tableau = within(résultatNetComptable).getByRole("table");
      expect(tableau).toBeInTheDocument();

      const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
      const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.MONTANT });
      expect(annéeLigneDEnTête).toBeInTheDocument();
      expect(indicateurLigneDEnTête).toBeInTheDocument();

      const annéesEtMontants = [
        {
          année: "2020",
          montant: "−38 331 €",
        },
        {
          année: "2021",
          montant: "3 034 €",
        },
        {
          année: "2022",
          montant: "7 290 €",
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(3);
      annéesEtMontants.forEach((annéeEtMontant, index) => {
        const année = within(lignes[index]).getByRole("cell", { name: annéeEtMontant.année });
        expect(année).toBeInTheDocument();
        const montant = within(lignes[index]).getByRole("cell", { name: annéeEtMontant.montant });
        expect(montant).toBeInTheDocument();
      });
    });

    it('affiche le contenu de l’info bulle %s après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.résultatNetComptable];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = screen.getByRole("dialog", { name: wording.RÉSULTAT_NET_COMPTABLE });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
      const abréviationSourceOrigine = within(infoBulle).getAllByText("CNSA", { selector: "abbr" });
      expect(abréviationSourceOrigine[0]).toHaveAttribute("title", wording.CNSA_TITLE);
      const élémentsDeCompréhension = within(infoBulle).getByRole("region", { name: wording.ÉLÉMENTS_DE_COMPRÉHENSION });
      expect(élémentsDeCompréhension).toBeInTheDocument();
      const fréquence = within(infoBulle).getByRole("region", { name: wording.FRÉQUENCE });
      expect(fréquence).toBeInTheDocument();
      const sources = within(infoBulle).getByRole("region", { name: wording.SOURCES });
      expect(sources).toBeInTheDocument();
    });
  });

  describe("L’indicateur du montant de la contribution aux frais de siège et/ou groupement", () => {
    it("affiche un tableau des 3 années passées", () => {
      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const contributionAuxFraisDeSiège = indicateurs[indiceDeLIndicateur.contributionAuxFraisDeSiège];
      const tableau = within(contributionAuxFraisDeSiège).getByRole("table");
      expect(tableau).toBeInTheDocument();

      const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
      const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.MONTANT });
      expect(annéeLigneDEnTête).toBeInTheDocument();
      expect(indicateurLigneDEnTête).toBeInTheDocument();

      const annéesEtMontants = [
        {
          année: "2020",
          montant: "−30 000 €",
        },
        {
          année: "2021",
          montant: "−20 000 €",
        },
        {
          année: "2022",
          montant: "−10 000 €",
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(3);
      annéesEtMontants.forEach((annéeEtMontant, index) => {
        const année = within(lignes[index]).getByRole("cell", { name: annéeEtMontant.année });
        expect(année).toBeInTheDocument();
        const montant = within(lignes[index]).getByRole("cell", { name: annéeEtMontant.montant });
        expect(montant).toBeInTheDocument();
      });
    });
  });

  describe("L’indicateur du taux de caf", () => {
    it("affiche un tableau descriptif du taux de caf avec les trois années", () => {
      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const tauxDeCaf = indicateurs[indiceDeLIndicateur.tauxDeCafNette];
      const tableau = within(tauxDeCaf).getByRole("table");
      const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
      const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.TAUX_DE_CAF });
      expect(annéeLigneDEnTête).toBeInTheDocument();
      expect(indicateurLigneDEnTête).toBeInTheDocument();

      const annéesEtTauxDeCaf = [
        {
          année: "2020",
          tauxDeCaf: "38,3 %",
        },
        {
          année: "2021",
          tauxDeCaf: "16,5 %",
        },
        {
          année: "2022",
          tauxDeCaf: "13,5 %",
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      annéesEtTauxDeCaf.forEach((annéeEtTauxDeCaf, index) => {
        const année = within(lignes[index]).getByRole("cell", { name: annéeEtTauxDeCaf.année });
        expect(année).toBeInTheDocument();
        const tauxDeCaf = within(lignes[index]).getByRole("cell", { name: annéeEtTauxDeCaf.tauxDeCaf });
        expect(tauxDeCaf).toBeInTheDocument();
      });
    });

    it("affiche un tableau descriptif du taux de caf avec deux années", () => {
      // GIVEN
      const budgetFinanceViewModel = new ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel(
        [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2019 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020 }),
        ],
        wording,
        autorisationsMockData
      );

      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const tauxDeCaf = indicateurs[indiceDeLIndicateur.tauxDeCafNette - 1];
      const tableau = within(tauxDeCaf).getByRole("table");
      const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
      const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.TAUX_DE_CAF });
      expect(annéeLigneDEnTête).toBeInTheDocument();
      expect(indicateurLigneDEnTête).toBeInTheDocument();

      const annéesEtTauxDeCaf = [
        {
          année: "2019",
          tauxDeCaf: "13,5 %",
        },
        {
          année: "2020",
          tauxDeCaf: "13,5 %",
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      annéesEtTauxDeCaf.forEach((annéeEtTauxDeCaf, index) => {
        const année = within(lignes[index]).getByRole("cell", { name: annéeEtTauxDeCaf.année });
        expect(année).toBeInTheDocument();
        const tauxDeCaf = within(lignes[index]).getByRole("cell", { name: annéeEtTauxDeCaf.tauxDeCaf });
        expect(tauxDeCaf).toBeInTheDocument();
      });
    });

    it("affiche un tableau descriptif du taux de caf avec une seule année", () => {
      // GIVEN
      const budgetFinanceViewModel = new ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel(
        [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020 })],
        wording,
        autorisationsMockData
      );

      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const tauxDeCaf = indicateurs[indiceDeLIndicateur.tauxDeCafNette - 2];
      const tableau = within(tauxDeCaf).getByRole("table");
      const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
      const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.TAUX_DE_CAF });
      expect(annéeLigneDEnTête).toBeInTheDocument();
      expect(indicateurLigneDEnTête).toBeInTheDocument();

      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      const annéeDeLaPremièreLigne = within(lignes[0]).getByRole("cell", { name: "2020" });
      expect(annéeDeLaPremièreLigne).toBeInTheDocument();
      const valeurDeLaPremièreLigne = within(lignes[0]).getByRole("cell", { name: "13,5 %" });
      expect(valeurDeLaPremièreLigne).toBeInTheDocument();
    });
  });

  describe("L’indicateur du taux de vétusté construction", () => {
    it("affiche un tableau descriptif avec les trois années", () => {
      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const tauxDeVétustéConstruction = indicateurs[indiceDeLIndicateur.tauxDeVétustéConstruction];
      const tableau = within(tauxDeVétustéConstruction).getByRole("table");
      const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
      const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION });
      expect(annéeLigneDEnTête).toBeInTheDocument();
      expect(indicateurLigneDEnTête).toBeInTheDocument();

      const annéesEtTauxDeVétusté = [
        {
          année: "2020",
          tauxDeVétusté: "31,2 %",
        },
        {
          année: "2021",
          tauxDeVétusté: "53,2 %",
        },
        {
          année: "2022",
          tauxDeVétusté: "38,8 %",
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      annéesEtTauxDeVétusté.forEach((annéeEtTauxDeVétusté, index) => {
        const année = within(lignes[index]).getByRole("cell", { name: annéeEtTauxDeVétusté.année });
        expect(année).toBeInTheDocument();
        const tauxDeVétusté = within(lignes[index]).getByRole("cell", { name: annéeEtTauxDeVétusté.tauxDeVétusté });
        expect(tauxDeVétusté).toBeInTheDocument();
      });
    });

    it("affiche un tableau descriptif avec deux années", () => {
      // GIVEN
      const budgetFinanceViewModel = new ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel(
        [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2021 }),
        ],
        wording,
        autorisationsMockData
      );

      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const tauxDeVétustéConstruction = indicateurs[indiceDeLIndicateur.tauxDeVétustéConstruction - 1];
      const tableau = within(tauxDeVétustéConstruction).getByRole("table");
      const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
      const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION });
      expect(annéeLigneDEnTête).toBeInTheDocument();
      expect(indicateurLigneDEnTête).toBeInTheDocument();

      const annéesEtTauxDeVétusté = [
        {
          année: "2020",
          tauxDeVétusté: "38,8 %",
        },
        {
          année: "2021",
          tauxDeVétusté: "38,8 %",
        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      annéesEtTauxDeVétusté.forEach((annéeEtTauxDeVétusté, index) => {
        const année = within(lignes[index]).getByRole("cell", { name: annéeEtTauxDeVétusté.année });
        expect(année).toBeInTheDocument();
        const tauxDeVétusté = within(lignes[index]).getByRole("cell", { name: annéeEtTauxDeVétusté.tauxDeVétusté });
        expect(tauxDeVétusté).toBeInTheDocument();
      });
    });

    it("affiche un tableau descriptif avec une seule année", () => {
      // GIVEN
      const budgetFinanceViewModel = new ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel(
        [ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2020 })],
        wording,
        autorisationsMockData
      );

      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const tauxDeVétustéConstruction = indicateurs[indiceDeLIndicateur.tauxDeVétustéConstruction - 2];
      const tableau = within(tauxDeVétustéConstruction).getByRole("table");
      const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
      const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION });
      expect(annéeLigneDEnTête).toBeInTheDocument();
      expect(indicateurLigneDEnTête).toBeInTheDocument();

      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      const annéeDeLaPremièreLigne = within(lignes[0]).getByRole("cell", { name: "2020" });
      expect(annéeDeLaPremièreLigne).toBeInTheDocument();
      const valeurDeLaPremièreLigne = within(lignes[0]).getByRole("cell", { name: "38,8 %" });
      expect(valeurDeLaPremièreLigne).toBeInTheDocument();
    });
  });

  describe("L’indicateur du fonds de roulement net global", () => {
    it("affiche un tableau affichant le fonds de roulement net global des 3 années passées d’un établissement sous cadre ERRD", () => {
      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const fondsDeRoulement = indicateurs[indiceDeLIndicateur.fondsDeRoulement];
      const tableau = within(fondsDeRoulement).getByRole("table");
      expect(tableau).toBeInTheDocument();

      const annéeLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.ANNÉE });
      const indicateurLigneDEnTête = within(tableau).getByRole("columnheader", { name: wording.MONTANT });
      expect(annéeLigneDEnTête).toBeInTheDocument();
      expect(indicateurLigneDEnTête).toBeInTheDocument();

      const annéesEtMontants = [
        {
          année: "2020",
          montant: "2 206 969 €",
        },
        {
          année: "2021",
          montant: "3 988 284 €",
        },
        {
          année: "2022",
          montant: "1 057 218 €",

        },
      ];
      const tbody = within(tableau).getAllByRole("rowgroup")[1];
      const lignes = within(tbody).getAllByRole("row");
      expect(lignes).toHaveLength(3);
      annéesEtMontants.forEach((annéeEtMontant, index) => {
        const année = within(lignes[index]).getByRole("cell", { name: annéeEtMontant.année });
        expect(année).toBeInTheDocument();
        const montant = within(lignes[index]).getByRole("cell", { name: annéeEtMontant.montant });
        expect(montant).toBeInTheDocument();
      });
    });

    it("n’affiche pas de mise en exergue pour les années sous un autre cadre budgétaire que ERRD", () => {
      // GIVEN
      const budgetFinanceViewModel = new ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel(
        [
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPa({ année: 2020 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesCaPh({ année: 2021 }),
          ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.créeUneAnnéeBudgetEtFinancesErrd({ année: 2022 }),
        ],
        wording,
        autorisationsMockData
      );

      // WHEN
      renderFakeComponent(<BlocBudgetEtFinancesMédicoSocial établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={budgetFinanceViewModel} />);

      // THEN
      const budgetEtFinances = screen.getByRole("region", { name: wording.TITRE_BLOC_BUDGET_ET_FINANCES });
      const indicateurs = within(budgetEtFinances).getAllByRole("listitem");
      const indicateur = indicateurs[indiceDeLIndicateur.fondsDeRoulement];
      expect(within(indicateur).queryByText(wording.AUCUNE_DONNÉE_RENSEIGNÉE)).not.toBeInTheDocument();
    });
  });
});