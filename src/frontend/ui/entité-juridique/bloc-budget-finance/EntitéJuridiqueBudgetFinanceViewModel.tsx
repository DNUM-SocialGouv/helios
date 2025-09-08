import { AllocationRessourcesViewModel } from "./AllocationRessourcesViewModel";
import { RatioDependanceFinanciereViewModel } from "./ratio-dependance-financiere/RatioDependanceFinanciereViewModel";
import { IAllocationRessources } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAllocationRessources";
import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { couleurDuFondHistogrammeBleuFoncé, couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";
import { HistogrammeData } from "../../commun/Graphique/HistogrammesHorizontaux";
import { StringFormater } from "../../commun/StringFormater";
import { ResultatNetComptableViewModel } from "../../indicateur-métier/resultat-net-comptable/ResultatNetComptableViewModel";
import { TauxDeCafViewModel } from "../../indicateur-métier/taux-de-caf/TauxDeCafViewModel";

type Itype = 'EJ' | 'ET_PNL' | 'ET_Autres';

export class EntitéJuridiqueBudgetFinanceViewModel {
  private budgetEtFinance: EntitéJuridiqueBudgetFinance[];
  public allocationRessources: AllocationRessourcesViewModel;
  public resultatNetComptable: ResultatNetComptableViewModel;
  private wording: Wording;
  public NOMBRE_ANNEES = 5;
  public ratioDependanceFinanciere: RatioDependanceFinanciereViewModel;
  public tauxDeCafViewModel: TauxDeCafViewModel;
  public autorisations: any;

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[], allocationRessources: IAllocationRessources, wording: Wording, autorisations: any) {
    this.wording = wording;
    this.budgetEtFinance = budgetFinance;

    this.allocationRessources = new AllocationRessourcesViewModel(allocationRessources, wording, autorisations);

    this.resultatNetComptable = new ResultatNetComptableViewModel(budgetFinance, autorisations);
    this.ratioDependanceFinanciere = new RatioDependanceFinanciereViewModel(budgetFinance, autorisations);
    this.tauxDeCafViewModel = TauxDeCafViewModel.fromBudgetFinanceEntiteJuridique(budgetFinance, autorisations, wording);
    this.autorisations = autorisations;
  }

  public get annéeInitiale() {
    const years = this.budgetEtFinance.filter((budgetEtFinance) => !this.compteResultatVide(budgetEtFinance)).map((budgetFinance) => budgetFinance.année);
    const anneesTriees = years.sort((année1, année2) => année2 - année1);
    return anneesTriees[0];
  }

  budgetEtFinanceEnCours(annéeEnCours: number): EntitéJuridiqueBudgetFinance {
    return this.budgetEtFinance.find((budgetEtFinance) => budgetEtFinance.année === annéeEnCours) as EntitéJuridiqueBudgetFinance;
  }

  public get lesDonnéesBudgetEtFinanceNeSontPasRenseignées() {
    return (
      (!this.budgetEtFinance) ||
      (this.budgetEtFinance.length === 0) ||
      (this.compteDeResultatVide() &&
        !this.resultatNetComptable.auMoinsUnResultatNetRenseigné() &&
        !this.ratioDependanceFinanciere.auMoinsUnRatioRenseigné() &&
        !this.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné)
    );
  }

  public lesDonnéesBudgetairePasRenseignee(type: Itype): string[] {
    const nonRenseignees = [];
    if (type === 'EJ' || type === 'ET_PNL') {
      if (this.compteDeResultatVide()) nonRenseignees.push(this.wording.COMPTE_DE_RÉSULTAT_CF);
      if (!this.resultatNetComptable.auMoinsUnResultatNetRenseigné()) nonRenseignees.push(this.wording.RÉSULTAT_NET_COMPTABLE);
      if (!this.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné) nonRenseignees.push(this.wording.TAUX_DE_CAF);
      if (!this.ratioDependanceFinanciere.auMoinsUnRatioRenseigné()) nonRenseignees.push(this.wording.RATIO_DEPENDANCE_FINANCIERE);
    }

    if (this.allocationRessources.vide()) nonRenseignees.push(this.wording.ALLOCATION_DE_RESSOURCES);
    return nonRenseignees;
  }

  public lesDonnéesBudgetairePasAutorisés(type: Itype): string[] {
    const nonAutorisés = [];
    if (type === 'EJ' || type === 'ET_PNL') {
      if (!this.compteDeResultatEstIlAutorisé) nonAutorisés.push(this.wording.COMPTE_DE_RÉSULTAT_CF);
      if (!this.resultatNetComptable.resultatNetComptableEstIlAutorisé) nonAutorisés.push(this.wording.RÉSULTAT_NET_COMPTABLE);
      if (!this.tauxDeCafViewModel.leTauxDeCafEstIlAutorisé) nonAutorisés.push(this.wording.TAUX_DE_CAF);
      if (!this.ratioDependanceFinanciere.ratioDependanceFinanciereEstIlAutorisé) nonAutorisés.push(this.wording.RATIO_DEPENDANCE_FINANCIERE);
    }

    if (!this.allocationRessources.estIlAutorisé) nonAutorisés.push(this.wording.ALLOCATION_DE_RESSOURCES);

    return nonAutorisés;
  }

  public lesAnnéesManquantesDuCompteDeRésultat(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuCompteDeRésultat(), this.NOMBRE_ANNEES);
  }

  public lesAnnéesEffectivesDuCompteDeRésultat(): number[] {
    return this.budgetEtFinance.filter((budgetEtFinance) => !this.compteResultatVide(budgetEtFinance)).map((budgetFinance) => budgetFinance.année);
  }

  public compteDeResultatVide() {
    return this.budgetEtFinance.every(this.compteResultatVide);
  }

  public get compteDeResultatEstIlAutorisé() {
    if (
      this.autorisations &&
      this.autorisations.budgetEtFinance &&
      this.autorisations.budgetEtFinance.compteRésultats &&
      this.autorisations.budgetEtFinance.compteRésultats === 'ok') {
      return true
    }
    return false
  }

  private compteResultatVide(budgetFinance: EntitéJuridiqueBudgetFinance): boolean {
    return (
      budgetFinance.depensesTitreIPrincipales === null &&
      budgetFinance.depensesTitreIIPrincipales === null &&
      budgetFinance.depensesTitreIIIPrincipales === null &&
      budgetFinance.depensesTitreIVPrincipales === null &&
      budgetFinance.recettesTitreIPrincipales === null &&
      budgetFinance.recettesTitreIIPrincipales === null &&
      budgetFinance.recettesTitreIIIPrincipales === null &&
      budgetFinance.recettesTitreIGlobal === null &&
      budgetFinance.recettesTitreIIGlobal === null &&
      budgetFinance.recettesTitreIIIGlobal === null &&
      budgetFinance.recettesTitreIVGlobal === null &&
      budgetFinance.depensesTitreIGlobal === null &&
      budgetFinance.depensesTitreIIGlobal === null &&
      budgetFinance.depensesTitreIIIGlobal === null &&
      budgetFinance.depensesTitreIVGlobal === null
    );
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formatDate(this.budgetEtFinance[0]?.dateMiseÀJourSource as string);
  }

  public dataGraphiqueCharges(budget: EntitéJuridiqueBudgetFinance): HistogrammeData {
    const depensesGlobales = [
      budget.totalDepensesGlobal,
      budget?.depensesTitreIGlobal,
      budget?.depensesTitreIIGlobal,
      budget?.depensesTitreIIIGlobal,
      budget?.depensesTitreIVGlobal,
    ]
      .map(Number)
      .map(Math.round)
      .map(Math.abs);
    const depensesPrincipales = [
      budget.totalDepensesPrincipales,
      budget?.depensesTitreIPrincipales,
      budget?.depensesTitreIIPrincipales,
      budget?.depensesTitreIIIPrincipales,
      budget?.depensesTitreIVPrincipales,
    ]
      .map(Number)
      .map(Math.round)
      .map(Math.abs);
    const depensesAnnexes = [
      budget.totalDepensesAnnexe,
      budget?.depensesTitreIAnnexe,
      budget?.depensesTitreIIAnnexe,
      budget?.depensesTitreIIIAnnexe,
      budget?.depensesTitreIVAnnexe,
    ]
      .map(Number)
      .map(Math.round)
      .map(Math.abs);
    return new HistogrammeData(
      this.wording.CHARGES,
      [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      depensesGlobales,
      [
        {
          backgroundColor: this.getBackgroundColorBudgetPrincipal(),
          data: depensesPrincipales,
          // isError: depensesPrincipales.map((depense) => depense > 0),
          label: this.wording.CHARGES_PRINCIPALES,
        },
        {
          label: this.wording.CHARGES_ANNEXES,
          data: depensesAnnexes,
          backgroundColor: this.getBackgroundColorBudgetSecondaire(),
          // isError: depensesAnnexes.map((depense) => depense > 0),
        },
      ],
      StringFormater.formatInEuro
    );
  }

  public dataGraphiqueProduits(budget: EntitéJuridiqueBudgetFinance): HistogrammeData {
    const produitsPrincipaux = [
      budget.totalRecettesPrincipales,
      budget?.recettesTitreIPrincipales,
      budget?.recettesTitreIIPrincipales,
      budget?.recettesTitreIIIPrincipales,
      0,
    ]
      .map(Number)
      .map(Math.round);
    const produitsGlobaux = [
      budget.totalRecettesGlobal,
      budget?.recettesTitreIGlobal,
      budget?.recettesTitreIIGlobal,
      budget?.recettesTitreIIIGlobal,
      budget?.recettesTitreIVGlobal,
    ]
      .map(Number)
      .map(Math.round);
    const produitsAnnexes = [
      budget.totalRecettesAnnexe,
      budget?.recettesTitreIAnnexe,
      budget?.recettesTitreIIAnnexe,
      budget?.recettesTitreIIIAnnexe,
      budget?.recettesTitreIVAnnexe,
    ]
      .map(Number)
      .map(Math.round);
    return new HistogrammeData(
      this.wording.PRODUITS,
      [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      produitsGlobaux,
      [
        {
          label: this.wording.PRODUITS_PRINCIPAUX,
          data: produitsPrincipaux,
          backgroundColor: this.getBackgroundColorBudgetPrincipal(),
          isError: produitsPrincipaux.map((depense) => depense < 0),
        },
        {
          label: this.wording.PRODUITS_ANNEXES,
          data: produitsAnnexes,
          backgroundColor: this.getBackgroundColorBudgetSecondaire(),
          isError: produitsAnnexes.map((depense) => depense < 0),
        },
      ],
      StringFormater.formatInEuro
    );
  }

  private getBackgroundColorBudgetSecondaire() {
    return ["#FA794A", "#FB9175", "#FB9175", "#FB9175", "#FB9175"];
  }

  private getBackgroundColorBudgetPrincipal() {
    return [
      couleurDuFondHistogrammeBleuFoncé,
      couleurDuFondHistogrammeSecondaire,
      couleurDuFondHistogrammeSecondaire,
      couleurDuFondHistogrammeSecondaire,
      couleurDuFondHistogrammeSecondaire,
    ];
  }

  get légendeChart(): string[] {
    return [this.wording.BUDGET_PRINCIPAL, this.wording.BUDGET_ANNEXE];
  }

}