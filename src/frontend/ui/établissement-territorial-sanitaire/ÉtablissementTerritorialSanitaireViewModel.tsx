import { ReactElement } from "react";

import { EtablissementTerritorialSanitaireActiviteViewModel } from "./bloc-activité/ÉtablissementTerritorialSanitaireActivitéViewModel";
import { EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel } from "./bloc-autorisations/ÉtablissementTerritorialSanitaireAutorisationsCapacitesViewModel";
import { EtablissementTerritorialSanitaireIdentiteViewModel } from "./bloc-identité/ÉtablissementTerritorialSanitaireIdentitéViewModel";
import { ÉtablissementTerritorialQualiteSanitaireViewModel } from "./bloc-qualite/ÉtablissementTerritorialQualiteSanitaireViewModel";
import { EtablissementTerritorialSanitaireRHViewModel } from "./bloc-ressources-humaines/EtablissementTerritorialSanitaireRHViewModel";
import { ÉtablissementTerritorialSanitaire } from "../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { Paths } from "../../configuration/Paths";
import { Wording } from "../../configuration/wording/Wording";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../entité-juridique/bloc-budget-finance/EntitéJuridiqueBudgetFinanceViewModel";

export class EtablissementTerritorialSanitaireViewModel {
  private readonly etablissementTerritorialSanitaireIdentitéViewModel: EtablissementTerritorialSanitaireIdentiteViewModel;
  private readonly etablissementTerritorialSanitaireActivitésViewModel: EtablissementTerritorialSanitaireActiviteViewModel;
  private readonly etablissementTerritorialSanitaireAutorisationsViewModel: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel;
  private readonly etablissementTerritorialSanitaireQualiteViewModel: ÉtablissementTerritorialQualiteSanitaireViewModel;
  private readonly etablissementTerritorialSanitaireRhViewModel: EtablissementTerritorialSanitaireRHViewModel;
  public entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialSanitaire, private readonly wording: Wording, paths: Paths, autorisations: any) {
    this.etablissementTerritorialSanitaireIdentitéViewModel = new EtablissementTerritorialSanitaireIdentiteViewModel(
      établissementTerritorial.identité,
      wording,
      paths
    );
    this.etablissementTerritorialSanitaireActivitésViewModel = new EtablissementTerritorialSanitaireActiviteViewModel(
      établissementTerritorial.activités,
      wording
    );
    this.etablissementTerritorialSanitaireAutorisationsViewModel = new EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel(
      établissementTerritorial.autorisationsEtCapacités,
      wording
    );
    this.etablissementTerritorialSanitaireQualiteViewModel = new ÉtablissementTerritorialQualiteSanitaireViewModel(wording, établissementTerritorial.qualite);
    this.entitéJuridiqueBudgetFinanceViewModel = new EntitéJuridiqueBudgetFinanceViewModel(
      établissementTerritorial.budgetFinance,
      établissementTerritorial.allocationRessource,
      wording,
      autorisations
    );
    this.etablissementTerritorialSanitaireRhViewModel = new EtablissementTerritorialSanitaireRHViewModel(établissementTerritorial.ressourcesHumaines, wording);
  }

  public get titre(): string {
    return `ET - ${this.etablissementTerritorialSanitaireIdentitéViewModel.numéroFinessÉtablissementTerritorial} - ${this.etablissementTerritorialSanitaireIdentitéViewModel.nomCourtDeLÉtablissementTerritorial}`;
  }

  public get titreAccessibleDeLEntitéJuridique(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        {" - "}
        {this.formateLeTitreDeLEntitéJuridiqueDeRattachement()}
      </>
    );
  }

  public get numéroFinessEntitéJuridiqueBrut(): string {
    return this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value;
  }

  public get identitéViewModel(): EtablissementTerritorialSanitaireIdentiteViewModel {
    return this.etablissementTerritorialSanitaireIdentitéViewModel;
  }

  public get activitésViewModel(): EtablissementTerritorialSanitaireActiviteViewModel {
    return this.etablissementTerritorialSanitaireActivitésViewModel;
  }

  public get autorisationsViewModel(): EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel {
    return this.etablissementTerritorialSanitaireAutorisationsViewModel;
  }

  public get qualiteViewModel(): ÉtablissementTerritorialQualiteSanitaireViewModel {
    return this.etablissementTerritorialSanitaireQualiteViewModel;
  }

  public get appartientAEtablissementsSantePrivesIntérêtsCollectif(): any {
    return this.établissementTerritorial.appartientAEtablissementsSantePrivesIntérêtsCollectif;
  }

  public get ressourcesHumainesViewModel(): EtablissementTerritorialSanitaireRHViewModel {
    return this.etablissementTerritorialSanitaireRhViewModel;
  }

  public blocRhDisponible(): boolean {
    return [this.wording.PUBLIC, this.wording.PRIVÉ_NON_LUCRATIF].includes(
      this.etablissementTerritorialSanitaireIdentitéViewModel.labelCategorisationDeLEntiteDeRattachement
    );
  }

  private formateLeTitreDeLEntitéJuridiqueDeRattachement() {
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement.value;
    return `${this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value} - ${nomDeLEntitéJuridique}`;
  }
}
