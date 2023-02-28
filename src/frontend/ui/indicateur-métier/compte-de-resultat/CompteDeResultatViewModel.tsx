import { ChangeEvent, ReactElement } from "react";

import { CadreBudgétaire } from "../../../../../database/models/BudgetEtFinancesMédicoSocialModel";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { Select } from "../../commun/Select/Select";
import { StringFormater } from "../../commun/StringFormater";

export class CompteDeResultatViewModel extends GraphiqueViewModel {
  private readonly nombreDAnnéesParIndicateur = 3;

  constructor(private readonly budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances[], wording: Wording) {
    super(wording);
  }

  public intituléDuCompteDeRésultat(annéeEnCours: number) {
    return this.budgetEtFinanceEnCours(annéeEnCours).cadreBudgétaire === CadreBudgétaire.ERRD
      ? this.wording.COMPTE_DE_RÉSULTAT_ERRD
      : this.wording.COMPTE_DE_RÉSULTAT_CA;
  }

  private budgetEtFinanceEnCours(annéeEnCours: number): ÉtablissementTerritorialMédicoSocialBudgetEtFinances {
    return this.budgetEtFinancesMédicoSocial.find(
      (budgetEtFinance) => budgetEtFinance.année === annéeEnCours
    ) as ÉtablissementTerritorialMédicoSocialBudgetEtFinances;
  }

  public listeDéroulanteDesAnnéesDuCompteDeRésultat(setAnnéeEnCours: Function): ReactElement {
    const annéesRangéesAntéChronologiquement = this.annéesRangéesParAntéChronologie();

    if (annéesRangéesAntéChronologiquement.length > 0) {
      return (
        <Select
          label={this.wording.ANNÉE}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setAnnéeEnCours(Number(event.target.value));
          }}
          options={annéesRangéesAntéChronologiquement}
        />
      );
    }

    return <></>;
  }

  private annéesRangéesParAntéChronologie(): number[] {
    return this.budgetEtFinancesMédicoSocial
      .filter(filtreParCadreBudgétaireEtRecettesEtDépenses)
      .map((budgetEtFinance) => budgetEtFinance.année)
      .reverse();

    function filtreParCadreBudgétaireEtRecettesEtDépenses(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances): boolean {
      if (
        budgetEtFinance.cadreBudgétaire !== CadreBudgétaire.CA_PA &&
        (budgetEtFinance.recettesEtDépenses.dépensesGroupe1 !== null ||
          budgetEtFinance.recettesEtDépenses.dépensesGroupe2 !== null ||
          budgetEtFinance.recettesEtDépenses.dépensesGroupe3 !== null ||
          budgetEtFinance.recettesEtDépenses.recettesGroupe1 !== null ||
          budgetEtFinance.recettesEtDépenses.recettesGroupe2 !== null ||
          budgetEtFinance.recettesEtDépenses.recettesGroupe3 !== null)
      ) {
        return true;
      } else if (
        budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA &&
        (budgetEtFinance.chargesEtProduits.charges !== null || budgetEtFinance.chargesEtProduits.produits !== null)
      ) {
        return true;
      }
      return false;
    }
  }

  public compteDeRésultat(annéeEnCours: number): ReactElement {
    const budgetEtFinance = this.budgetEtFinanceEnCours(annéeEnCours);
    const entêtePremièreColonne = this.wording.TITRE_BUDGÉTAIRE;
    const chartColors = [
      this.couleurDuFondHistogrammePrimaire,
      this.couleurDuFondHistogrammeSecondaire,
      this.couleurDuFondHistogrammeSecondaire,
      this.couleurDuFondHistogrammeSecondaire,
    ];
    const dépensesOuCharges = [];
    const recettesOuProduits = [];
    const libellés = [];
    const entêtesDesAutresColonnes = [];
    const annéesManquantes = this.lesAnnéesManquantesDuCompteDeRésultat();

    let ratioHistogramme = 2;
    if (budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA) {
      const totalDesCharges = budgetEtFinance.chargesEtProduits.charges as number;
      const totalDesProduits = budgetEtFinance.chargesEtProduits.produits as number;
      dépensesOuCharges.push(totalDesCharges);
      recettesOuProduits.push(totalDesProduits);
      libellés.push(this.wording.TOTAL);
      entêtesDesAutresColonnes.push(this.wording.CHARGES, this.wording.PRODUITS);
      ratioHistogramme = 5;
    } else {
      const dépensesGroupeI = budgetEtFinance.recettesEtDépenses.dépensesGroupe1 as number;
      const dépensesGroupeII = budgetEtFinance.recettesEtDépenses.dépensesGroupe2 as number;
      const dépensesGroupeIII = budgetEtFinance.recettesEtDépenses.dépensesGroupe3 as number;
      const recettesGroupeI = budgetEtFinance.recettesEtDépenses.recettesGroupe1 as number;
      const recettesGroupeII = budgetEtFinance.recettesEtDépenses.recettesGroupe2 as number;
      const recettesGroupeIII = budgetEtFinance.recettesEtDépenses.recettesGroupe3 as number;
      const totalDesDépenses = dépensesGroupeI + dépensesGroupeII + dépensesGroupeIII;
      const totalDesRecettes = recettesGroupeI + recettesGroupeII + recettesGroupeIII;
      dépensesOuCharges.push(totalDesDépenses, dépensesGroupeI, dépensesGroupeII, dépensesGroupeIII);
      recettesOuProduits.push(totalDesRecettes, recettesGroupeI, recettesGroupeII, recettesGroupeIII);
      libellés.push(this.wording.TOTAL, this.wording.GROUPE_I, this.wording.GROUPE_II, this.wording.GROUPE_III);
      entêtesDesAutresColonnes.push(this.wording.DÉPENSES, this.wording.RECETTES);
    }

    return this.afficheUnCarrousel(
      chartColors,
      dépensesOuCharges,
      recettesOuProduits,
      libellés,
      ratioHistogramme,
      entêtePremièreColonne,
      entêtesDesAutresColonnes,
      annéesManquantes
    );
  }

  public get leCompteDeRésultatEstIlRenseigné(): boolean {
    return this.lesAnnéesManquantesDuCompteDeRésultat().length < this.nombreDAnnéesParIndicateur;
  }

  private lesAnnéesManquantesDuCompteDeRésultat(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuCompteDeRésultat());
  }

  private lesAnnéesEffectivesDuCompteDeRésultat(): number[] {
    const années: number[] = [];

    this.budgetEtFinancesMédicoSocial.forEach((budgetEtFinance) => {
      if (budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA) {
        if (budgetEtFinance.chargesEtProduits.charges !== null && budgetEtFinance.chargesEtProduits.produits !== null) {
          années.push(budgetEtFinance.année);
        }
      } else {
        if (
          budgetEtFinance.recettesEtDépenses.dépensesGroupe1 !== null &&
          budgetEtFinance.recettesEtDépenses.dépensesGroupe2 !== null &&
          budgetEtFinance.recettesEtDépenses.dépensesGroupe3 !== null &&
          budgetEtFinance.recettesEtDépenses.recettesGroupe1 !== null &&
          budgetEtFinance.recettesEtDépenses.recettesGroupe2 !== null &&
          budgetEtFinance.recettesEtDépenses.recettesGroupe3 !== null
        ) {
          années.push(budgetEtFinance.année);
        }
      }
    });

    return années;
  }

  public get annéeInitiale() {
    return this.budgetEtFinancesMédicoSocial[this.budgetEtFinancesMédicoSocial.length - 1]?.année;
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].tauxDeVétustéConstruction?.dateMiseÀJourSource as string);
  }
}
