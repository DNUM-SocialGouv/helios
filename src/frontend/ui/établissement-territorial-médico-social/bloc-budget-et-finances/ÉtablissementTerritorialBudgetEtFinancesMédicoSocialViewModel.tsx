import { ReactElement } from "react";

import { CadreBudgétaire } from "../../../../backend/métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import {
  couleurDuFond,
  couleurDuFondHistogrammePrimaire,
  couleurDuFondHistogrammeSecondaire,
  couleurErreur,
  couleurIdentifiant,
  couleurSecondPlanHistogrammeDeDépassement,
  CouleurHistogramme,
} from "../../commun/Graphique/couleursGraphique";
import { HistogrammeVertical } from "../../commun/Graphique/HistogrammeVertical";
import { IndicateurTabulaire, IndicateurTabulaireProps } from "../../commun/IndicateurTabulaire/IndicateurTabulaire";
import { StringFormater } from "../../commun/StringFormater";
import { TauxDeCafViewModel } from "../../indicateur-métier/taux-de-caf/TauxDeCafViewModel";
import { CompteDeResultatViewModel } from "./compte-de-resultat/CompteDeResultatViewModel";

export class ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel {
  private readonly seuilMinimalDuTauxDeVétustéConstruction = 0;
  private readonly seuilMaximalDuTauxDeVétustéConstruction = 80;
  private readonly seuilDuContrasteDuLibellé = 10;
  private readonly nombreDAnnéesParIndicateur = 3;
  public compteDeResultatViewModel: CompteDeResultatViewModel;
  public tauxDeCafViewModel: TauxDeCafViewModel;
  public autorisations: any;

  constructor(
    private readonly budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances[],
    private wording: Wording,
    autorisations: any
  ) {
    this.compteDeResultatViewModel = new CompteDeResultatViewModel(budgetEtFinancesMédicoSocial, wording);
    this.tauxDeCafViewModel = TauxDeCafViewModel.fromBudgetFinanceMedicoSocial(budgetEtFinancesMédicoSocial, wording, autorisations);
    this.autorisations = autorisations;
  }

  public get lesDonnéesBudgetEtFinancesNeSontPasRenseignées(): boolean {
    return (
      !this.compteDeResultatViewModel.leCompteDeRésultatEstIlRenseigné &&
      !this.leRésultatNetComptableEstIlRenseigné &&
      !this.leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné &&
      !this.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné &&
      !this.leTauxDeVétustéEstIlRenseigné &&
      !this.leFondsDeRoulementEstIlRenseigné
    );
  }

  public get lesDonnéesBudgetairesPasRenseignees(): string[] {
    const nonRenseignees = [];

    if (!this.compteDeResultatViewModel.leCompteDeRésultatEstIlRenseigné) nonRenseignees.push(this.wording.COMPTE_DE_RÉSULTAT);
    if (!this.leRésultatNetComptableEstIlRenseigné) nonRenseignees.push(this.wording.RÉSULTAT_NET_COMPTABLE);
    if (!this.leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné) nonRenseignees.push(this.wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE);
    if (!this.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné) nonRenseignees.push(this.wording.TAUX_DE_CAF);
    if (!this.leTauxDeVétustéEstIlRenseigné) nonRenseignees.push(this.wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION);
    if (!this.leFondsDeRoulementEstIlRenseigné) nonRenseignees.push(this.wording.FONDS_DE_ROULEMENT_NET_GLOBAL);

    return nonRenseignees;
  }

  public get montantDeLaContributionAuxFraisDeSiège(): ReactElement {
    const montantDesContributionsAuxFraisDeSiègeParAnnée: { année: number; valeur: string }[] = this.budgetEtFinancesMédicoSocial.reduce(
      (montantParAnnée: { année: number; valeur: string }[], budgetEtFinancesMédicoSocial) => {
        if (
          budgetEtFinancesMédicoSocial.contributionAuxFraisDeSiège.valeur !== null &&
          budgetEtFinancesMédicoSocial.contributionAuxFraisDeSiège.valeur !== ""
        ) {
          montantParAnnée.push({
            année: budgetEtFinancesMédicoSocial.année,
            valeur: StringFormater.formatInEuro(budgetEtFinancesMédicoSocial.contributionAuxFraisDeSiège.valeur),
          });
        }
        return montantParAnnée;
      },
      []
    );

    const listeAnnéesManquantes = annéesManquantes(
      montantDesContributionsAuxFraisDeSiègeParAnnée.map(
        (montantDesContributionsAuxFraisDeSiègeParAnnée) => montantDesContributionsAuxFraisDeSiègeParAnnée.année
      )
    );

    return <IndicateurTabulaire annéesManquantes={listeAnnéesManquantes} valeursParAnnée={montantDesContributionsAuxFraisDeSiègeParAnnée} />;
  }

  public get dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].contributionAuxFraisDeSiège?.dateMiseÀJourSource as string);
  }

  public get leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.contributionAuxFraisDeSiège.valeur !== null);
  }

  public get leMontantDeLaContributionAuxFraisDeSiègeEstIlAutorisé(): boolean {
    if (
      this.autorisations &&
      this.autorisations.budgetEtFinances &&
      this.autorisations.budgetEtFinances.contributionAuxFraisDeSiège &&
      this.autorisations.budgetEtFinances.contributionAuxFraisDeSiège === "ok"
    ) {
      return true;
    }
    return false;
  }

  public get leTauxDeVétustéEstIlRenseigné(): boolean {
    const [années] = this.construisLesAnnéesEtSesTaux("tauxDeVétustéConstruction");

    return années.length > 0;
  }

  public get leTauxDeVétustéEstIlAutorisé(): boolean {
    if (
      this.autorisations &&
      this.autorisations.budgetEtFinances &&
      this.autorisations.budgetEtFinances.tauxDeVétustéConstruction &&
      this.autorisations.budgetEtFinances.tauxDeVétustéConstruction === "ok"
    ) {
      return true;
    }
    return false;
  }

  private construisLaCouleurDeLaBarre(valeur: number, année: number | string): CouleurHistogramme {
    let premierPlan = couleurDuFondHistogrammeSecondaire;
    let secondPlan = couleurDuFond;

    if (estCeLAnnéePassée(année)) {
      premierPlan = couleurDuFondHistogrammePrimaire;
      secondPlan = couleurDuFond;
    }

    if (this.leTauxDeVétustéConstructionEstIlAberrant(valeur)) {
      premierPlan = couleurErreur;
      secondPlan = couleurSecondPlanHistogrammeDeDépassement;
    }
    return { premierPlan, secondPlan };
  }

  public get tauxDeVétustéConstruction(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux("tauxDeVétustéConstruction");

    const libellésDesValeurs = valeurs.map((valeur) => (valeur > this.seuilDuContrasteDuLibellé ? couleurDuFond : couleurIdentifiant));
    const libellésDesTicks = années.map((année) => (estCeLAnnéePassée(année) ? "bold" : "normal"));

    return (
      <HistogrammeVertical
        annéesTotales={3}
        couleurDesLibelles={libellésDesValeurs}
        couleursDeLHistogramme={valeurs.map((valeur: number, index: number) => this.construisLaCouleurDeLaBarre(valeur, années[index]))}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION}
        libellés={années}
        taillePoliceTicks={libellésDesTicks}
        valeurs={valeurs}
      />
    );
  }

  public get dateMiseÀJourTauxDeVétustéConstruction(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].tauxDeVétustéConstruction?.dateMiseÀJourSource as string);
  }

  private leTauxDeVétustéConstructionEstIlAberrant = (valeur: number): boolean => {
    return valeur > this.seuilMaximalDuTauxDeVétustéConstruction || valeur < this.seuilMinimalDuTauxDeVétustéConstruction;
  };

  public get résultatNetComptable(): ReactElement {
    const résultatNetComptableParAnnée: { année: number; valeur: string }[] = this.budgetEtFinancesMédicoSocial.reduce(
      (résultatNetComptableParAnnée: { année: number; valeur: string }[], budgetEtFinancesMédicoSocial) => {
        if (budgetEtFinancesMédicoSocial.résultatNetComptable.valeur !== null && budgetEtFinancesMédicoSocial.résultatNetComptable.valeur !== "") {
          résultatNetComptableParAnnée.push({
            année: budgetEtFinancesMédicoSocial.année,
            valeur: StringFormater.formatInEuro(budgetEtFinancesMédicoSocial.résultatNetComptable.valeur),
          });
        }
        return résultatNetComptableParAnnée;
      },
      []
    );

    const listeAnnéesManquantes = annéesManquantes(this.budgetEtFinancesMédicoSocial.map((résultatNetComptableParAnnée) => résultatNetComptableParAnnée.année));

    return <IndicateurTabulaire annéesManquantes={listeAnnéesManquantes} valeursParAnnée={résultatNetComptableParAnnée} />;
  }

  public get dateMiseÀJourRésultatNetComptable(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].résultatNetComptable?.dateMiseÀJourSource as string);
  }

  public get leRésultatNetComptableEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.résultatNetComptable.valeur !== null);
  }

  public get leRésultatNetComptableEstIlAutorisé(): boolean {
    if (
      this.autorisations &&
      this.autorisations.budgetEtFinances &&
      this.autorisations.budgetEtFinances.résultatNetComptable &&
      this.autorisations.budgetEtFinances.résultatNetComptable === "ok"
    ) {
      return true;
    }
    return false;
  }

  public get fondDeRoulementNetGlobal(): ReactElement {
    const annéesSousCadreAutreQueErrd: number[] = [];
    const fondsDeRoulementNetGlobalParAnnée: IndicateurTabulaireProps["valeursParAnnée"] = this.budgetEtFinancesMédicoSocial.reduce(
      (fondsParAnnée: IndicateurTabulaireProps["valeursParAnnée"], budgetEtFinancesMédicoSocial) => {
        if (budgetEtFinancesMédicoSocial.cadreBudgétaire === CadreBudgétaire.ERRD) {
          if (budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur !== null && budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur !== "") {
            fondsParAnnée.push({
              année: budgetEtFinancesMédicoSocial.année,
              miseEnForme: budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur < 0 ? "fr-text--bold fr-text-default--error" : "",
              valeur: StringFormater.formatInEuro(budgetEtFinancesMédicoSocial.fondsDeRoulement.valeur),
            });
          }
        } else {
          annéesSousCadreAutreQueErrd.push(budgetEtFinancesMédicoSocial.année);
        }
        return fondsParAnnée;
      },
      []
    );
    const annéesAvecDonnées = fondsDeRoulementNetGlobalParAnnée.map((fondsDeRoulementNetGlobalParAnnée) => fondsDeRoulementNetGlobalParAnnée.année);

    const annéesAvecMiseEnExergue = annéesManquantes(annéesAvecDonnées.concat(annéesSousCadreAutreQueErrd), this.nombreDAnnéesParIndicateur);

    return <IndicateurTabulaire annéesManquantes={annéesAvecMiseEnExergue} valeursParAnnée={fondsDeRoulementNetGlobalParAnnée} />;
  }

  public get dateMiseÀJourFondDeRoulementNetGlobal(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].fondsDeRoulement?.dateMiseÀJourSource as string);
  }

  public get leFondsDeRoulementEstIlRenseigné(): boolean {
    return this.budgetEtFinancesMédicoSocial.some((budgetEtFinances) => budgetEtFinances.fondsDeRoulement.valeur !== null);
  }

  public get leFondsDeRoulementEstIlAutorisé(): boolean {
    if (
      this.autorisations &&
      this.autorisations.budgetEtFinances &&
      this.autorisations.budgetEtFinances.fondsDeRoulement &&
      this.autorisations.budgetEtFinances.fondsDeRoulement === "ok"
    ) {
      return true;
    }
    return false;
  }

  private construisLesAnnéesEtSesTaux(
    indicateur: Exclude<keyof ÉtablissementTerritorialMédicoSocialBudgetEtFinances, "année" | "cadreBudgétaire" | "chargesEtProduits" | "recettesEtDépenses">
  ): number[][] {
    const valeurs: number[] = [];
    const années: number[] = [];
    this.budgetEtFinancesMédicoSocial.forEach((budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances) => {
      const valeur = budgetEtFinancesMédicoSocial[indicateur].valeur;
      if (valeur !== null && valeur !== "") {
        années.push(budgetEtFinancesMédicoSocial.année);
        valeurs.push(StringFormater.transformInRate(valeur));
      }
    });

    return [valeurs, années];
  }

  public get leTauxDeCafEstIlAutorisé(): boolean {
    if (
      this.autorisations &&
      this.autorisations.budgetEtFinances &&
      this.autorisations.budgetEtFinances.tauxDeCafNette &&
      this.autorisations.budgetEtFinances.tauxDeCafNette === "ok"
    ) {
      return true;
    }
    return false;
  }

  public get leCompteDeRésultatEstIlAutorisé() {
    if (
      this.autorisations &&
      this.autorisations.budgetEtFinances &&
      this.autorisations.budgetEtFinances.compteRésultats &&
      this.autorisations.budgetEtFinances.compteRésultats === "ok"
    ) {
      return true;
    }
    return false;
  }

  public get lesDonnéesBudgetairesPasAutorisés(): string[] {
    const nonAutorisés = [];

   if (!this.leCompteDeRésultatEstIlAutorisé) { nonAutorisés.push(this.wording.COMPTE_DE_RÉSULTAT);}
    if (!this.leRésultatNetComptableEstIlAutorisé) nonAutorisés.push(this.wording.RÉSULTAT_NET_COMPTABLE);
    if (!this.leMontantDeLaContributionAuxFraisDeSiègeEstIlAutorisé) nonAutorisés.push(this.wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE);
    if (!this.leTauxDeCafEstIlAutorisé) nonAutorisés.push(this.wording.TAUX_DE_CAF);
    if (!this.leTauxDeVétustéEstIlAutorisé) nonAutorisés.push(this.wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION);
    if (!this.leFondsDeRoulementEstIlAutorisé) nonAutorisés.push(this.wording.FONDS_DE_ROULEMENT_NET_GLOBAL);

    return nonAutorisés;
  }
}
