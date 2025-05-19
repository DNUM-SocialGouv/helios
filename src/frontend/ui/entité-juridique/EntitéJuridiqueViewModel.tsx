import { ReactElement } from "react";

import { EntitéJuridique } from "../../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { Wording } from "../../configuration/wording/Wording";
import { StringFormater } from "../commun/StringFormater";
import { ActivitésMensuelViewModel } from "./bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { EntiteJuridiqueActivitesViewModel } from "./bloc-activité/EntitéJuridiqueActivitésViewModel";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "./bloc-autorisations-capacites/EntitéJuridiqueAutorisationsCapacitesViewModel";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./bloc-budget-finance/EntitéJuridiqueBudgetFinanceViewModel";
import { CatégorisationViewModel } from "./catégorisation/CatégorisationViewModel";

export class EntiteJuridiqueViewModel {
  public catégorisationViewModel: CatégorisationViewModel;
  public entitéJuridiqueActivitéViewModel: EntiteJuridiqueActivitesViewModel;
  public entitéJuridiqueActivitéMensuelleViewModel: ActivitésMensuelViewModel;
  public entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
  public entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;

  constructor(private readonly entitéJuridique: EntitéJuridique, private readonly wording: Wording, autorisations: any) {
    this.catégorisationViewModel = new CatégorisationViewModel(entitéJuridique.catégorisation, wording);
    this.entitéJuridiqueActivitéViewModel = new EntiteJuridiqueActivitesViewModel(entitéJuridique.activités, wording);
    this.entitéJuridiqueActivitéMensuelleViewModel = new ActivitésMensuelViewModel(entitéJuridique.activitésMensuels, wording);
    this.entitéJuridiqueBudgetFinanceViewModel = new EntitéJuridiqueBudgetFinanceViewModel(
      entitéJuridique.budgetFinance,
      entitéJuridique.allocationRessource,
      wording,
      autorisations
    );
    this.entitéJuridiqueAutorisationsCapacitesViewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      entitéJuridique.autorisationsEtCapacites.capacités,
      entitéJuridique.autorisationsEtCapacites.autorisationsActivités,
      entitéJuridique.autorisationsEtCapacites.autresActivités,
      entitéJuridique.autorisationsEtCapacites.reconnaissanceContractuelleActivités,
      entitéJuridique.autorisationsEtCapacites.equipementMaterielLourdsActivités,
      wording
    );
  }

  public get titreAccessible(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        {" - "}
        {this.numéroFiness}
        {" - "}
        {this.nomCourtDeLEntitéJuridique}
      </>
    );
  }

  public get titre(): string {
    return `EJ - ${this.numéroFiness} - ${this.nomCourtDeLEntitéJuridique}`;
  }

  public get nomDeLEntitéJuridique(): string {
    return this.entitéJuridique.raisonSociale.value;
  }

  public get nomCourtDeLEntitéJuridique(): string {
    return this.entitéJuridique.raisonSocialeCourte.value;
  }

  public get dateDeMiseÀJourDuNomDeLEntitéJuridique(): string {
    return StringFormater.formatDate(this.entitéJuridique.raisonSociale.dateMiseÀJourSource);
  }

  public get dateOuvertureEntitéJuridique(): string {
    if (this.entitéJuridique.dateOuverture && this.entitéJuridique.dateOuverture.value) {
      return StringFormater.formatDate(this.entitéJuridique.dateOuverture.value);
    }
    return "Non renseigné";
  }

  public get dateDeMiseÀJourOuvertureEntitéJuridique(): string {
    if (this.entitéJuridique.dateOuverture && this.entitéJuridique.dateOuverture.dateMiseÀJourSource) {
      return StringFormater.formatDate(this.entitéJuridique.dateOuverture.dateMiseÀJourSource);
    }
    return "Non renseigné";
  }

  public get numéroFiness(): string {
    return this.entitéJuridique.numéroFinessEntitéJuridique.value;
  }

  public get dateDeMiseÀJourDusiren(): string {
    return StringFormater.formatDate(this.entitéJuridique.siren.dateMiseÀJourSource);
  }

  public get siren(): string {
    return this.entitéJuridique.siren.value;
  }

  public get dateDeMiseÀJourDuNuméroFiness(): string {
    return StringFormater.formatDate(this.entitéJuridique.numéroFinessEntitéJuridique.dateMiseÀJourSource);
  }

  public get adresse(): string {
    return `${this.entitéJuridique.adresseNuméroVoie.value} ${this.entitéJuridique.adresseTypeVoie.value} ${this.entitéJuridique.adresseVoie.value} ${this.entitéJuridique.adresseAcheminement.value}`;
  }

  public get dateDeMiseÀJourDeLAdresse(): string {
    return StringFormater.formatDate(this.entitéJuridique.adresseNuméroVoie.dateMiseÀJourSource);
  }

  public get téléphone(): string {
    return this.valeurOuNonRenseigné(StringFormater.formatPhoneNumber(this.entitéJuridique.téléphone.value));
  }

  public get dateDeMiseÀJourDuTéléphone(): string {
    return StringFormater.formatDate(this.entitéJuridique.téléphone.dateMiseÀJourSource);
  }

  public get statutDeLEntitéJuridique(): string {
    return this.entitéJuridique.libelléStatutJuridique.value;
  }

  public get dateDeMiseÀJourDuStatutDeLEntitéJuridique(): string {
    return StringFormater.formatDate(this.entitéJuridique.libelléStatutJuridique.dateMiseÀJourSource);
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === "" ? this.wording.NON_RENSEIGNÉ : valeur;
  }
}
