import { ReactElement } from "react";

import { ÉtablissementTerritorialSanitaire } from "../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { Paths } from "../../configuration/Paths";
import { Wording } from "../../configuration/wording/Wording";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../entité-juridique/bloc-budget-finance/EntitéJuridiqueBudgetFinanceViewModel";
import { ÉtablissementTerritorialSanitaireActivitéViewModel } from "./bloc-activité/ÉtablissementTerritorialSanitaireActivitéViewModel";
import { EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel } from "./bloc-autorisations/ÉtablissementTerritorialSanitaireAutorisationsCapacitesViewModel";
import { ÉtablissementTerritorialSanitaireIdentitéViewModel } from "./bloc-identité/ÉtablissementTerritorialSanitaireIdentitéViewModel";
import { ÉtablissementTerritorialQualiteSanitaireViewModel } from "./bloc-qualite/ÉtablissementTerritorialQualiteSanitaireViewModel";

export class ÉtablissementTerritorialSanitaireViewModel {
  private établissementTerritorialSanitaireIdentitéViewModel: ÉtablissementTerritorialSanitaireIdentitéViewModel;
  private établissementTerritorialSanitaireActivitésViewModel: ÉtablissementTerritorialSanitaireActivitéViewModel;
  private établissementTerritorialSanitaireAutorisationsViewModel: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel;
  private etablissementTerritorialSanitaireQualiteViewModel: ÉtablissementTerritorialQualiteSanitaireViewModel;
  public entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialSanitaire, private readonly wording: Wording, paths: Paths) {
    this.établissementTerritorialSanitaireIdentitéViewModel = new ÉtablissementTerritorialSanitaireIdentitéViewModel(
      établissementTerritorial.identité,
      wording,
      paths
    );
    this.établissementTerritorialSanitaireActivitésViewModel = new ÉtablissementTerritorialSanitaireActivitéViewModel(
      établissementTerritorial.activités,
      wording
    );
    this.établissementTerritorialSanitaireAutorisationsViewModel = new EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel(
      établissementTerritorial.autorisationsEtCapacités,
      wording
    );
    this.etablissementTerritorialSanitaireQualiteViewModel = new ÉtablissementTerritorialQualiteSanitaireViewModel(wording, établissementTerritorial.qualite);
    this.entitéJuridiqueBudgetFinanceViewModel = new EntitéJuridiqueBudgetFinanceViewModel(
      établissementTerritorial.budgetFinance,
      établissementTerritorial.allocationRessource,
      wording
    );
  }

  public get titre(): string {
    return `ET - ${this.établissementTerritorialSanitaireIdentitéViewModel.numéroFinessÉtablissementTerritorial} - ${this.établissementTerritorialSanitaireIdentitéViewModel.nomCourtDeLÉtablissementTerritorial}`;
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

  public get identitéViewModel(): ÉtablissementTerritorialSanitaireIdentitéViewModel {
    return this.établissementTerritorialSanitaireIdentitéViewModel;
  }

  public get activitésViewModel(): ÉtablissementTerritorialSanitaireActivitéViewModel {
    return this.établissementTerritorialSanitaireActivitésViewModel;
  }

  public get autorisationsViewModel(): EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel {
    return this.établissementTerritorialSanitaireAutorisationsViewModel;
  }

  public get qualiteViewModel(): ÉtablissementTerritorialQualiteSanitaireViewModel {
    return this.etablissementTerritorialSanitaireQualiteViewModel;
  }

  public get appartientAEtablissementsSantePrivesIntérêtsCollectif(): any {
    return this.établissementTerritorial.appartientAEtablissementsSantePrivesIntérêtsCollectif;
  }

  private formateLeTitreDeLEntitéJuridiqueDeRattachement() {
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement.value;
    return `${this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value} - ${nomDeLEntitéJuridique}`;
  }
}
