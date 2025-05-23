import { ReactElement } from "react";

import { EtablissementTerritorialSanitaireActiviteViewModel } from "./bloc-activité/ÉtablissementTerritorialSanitaireActivitéViewModel";
import { EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel } from "./bloc-autorisations/ÉtablissementTerritorialSanitaireAutorisationsCapacitesViewModel";
import { EtablissementTerritorialSanitaireIdentiteViewModel } from "./bloc-identité/ÉtablissementTerritorialSanitaireIdentitéViewModel";
import { ÉtablissementTerritorialQualiteSanitaireViewModel } from "./bloc-qualite/ÉtablissementTerritorialQualiteSanitaireViewModel";
import { ÉtablissementTerritorialSanitaire } from "../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { Paths } from "../../configuration/Paths";
import { Wording } from "../../configuration/wording/Wording";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../entité-juridique/bloc-budget-finance/EntitéJuridiqueBudgetFinanceViewModel";

export class EtablissementTerritorialSanitaireViewModel {
  private readonly établissementTerritorialSanitaireIdentitéViewModel: EtablissementTerritorialSanitaireIdentiteViewModel;
  private readonly établissementTerritorialSanitaireActivitésViewModel: EtablissementTerritorialSanitaireActiviteViewModel;
  private readonly établissementTerritorialSanitaireAutorisationsViewModel: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel;
  private readonly etablissementTerritorialSanitaireQualiteViewModel: ÉtablissementTerritorialQualiteSanitaireViewModel;
  public entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialSanitaire, private readonly wording: Wording, paths: Paths, autorisations: any) {
    this.établissementTerritorialSanitaireIdentitéViewModel = new EtablissementTerritorialSanitaireIdentiteViewModel(
      établissementTerritorial.identité,
      wording,
      paths
    );
    this.établissementTerritorialSanitaireActivitésViewModel = new EtablissementTerritorialSanitaireActiviteViewModel(
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
      wording,
      autorisations
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

  public get identitéViewModel(): EtablissementTerritorialSanitaireIdentiteViewModel {
    return this.établissementTerritorialSanitaireIdentitéViewModel;
  }

  public get activitésViewModel(): EtablissementTerritorialSanitaireActiviteViewModel {
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
