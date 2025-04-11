import { ReactElement } from "react";

import { ÉtablissementTerritorialMédicoSocialActivitéViewModel } from "./bloc-activité/ÉtablissementTerritorialMédicoSocialActivitéViewModel";
import { ÉtablissementTerritorialMédicoSocialAutorisationsViewModel } from "./bloc-autorisations/ÉtablissementTerritorialMédicoSocialAutorisationsViewModel";
import { ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel } from "./bloc-budget-et-finances/ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel";
import { EtablissementTerritorialMedicoSocialIdentiteViewModel } from "./bloc-identité/ÉtablissementTerritorialMédicoSocialIdentitéViewModel";
import { ÉtablissementTerritorialQualiteMédicoSocialViewModel } from "./bloc-qualite/ÉtablissementTerritorialQualiteMédicoSocialViewModel";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "./bloc-ressources-humaines/ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";
import { ÉtablissementTerritorialMédicoSocial } from "../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { Paths } from "../../configuration/Paths";
import { Wording } from "../../configuration/wording/Wording";

export class EtablissementTerritorialMedicoSocialViewModel {
  private readonly établissementTerritorialIdentitéMédicoSocialViewModel: EtablissementTerritorialMedicoSocialIdentiteViewModel;
  private readonly établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
  private readonly établissementTerritorialAutorisationsMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialAutorisationsViewModel;
  private readonly établissementTerritorialBudgetEtFinancesMédicoSocialViewModel: ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel;
  private readonly établissementTerritorialRessourcesHumainesMédicoSocialViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel;
  private readonly établissementTerritorialQualiteMédicoSocialViewModel: ÉtablissementTerritorialQualiteMédicoSocialViewModel;
  public autorisations: any;

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialMédicoSocial, private readonly wording: Wording, paths: Paths, autorisations: any) {
    this.établissementTerritorialIdentitéMédicoSocialViewModel = new EtablissementTerritorialMedicoSocialIdentiteViewModel(
      établissementTerritorial.identité,
      wording,
      paths
    );
    this.établissementTerritorialActivitéMédicoSocialViewModel = new ÉtablissementTerritorialMédicoSocialActivitéViewModel(
      établissementTerritorial.activités,
      wording
    );
    this.établissementTerritorialAutorisationsMédicoSocialViewModel = new ÉtablissementTerritorialMédicoSocialAutorisationsViewModel(
      établissementTerritorial.autorisationsEtCapacités,
      wording
    );
    this.établissementTerritorialBudgetEtFinancesMédicoSocialViewModel = new ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel(
      établissementTerritorial.budgetEtFinances,
      wording,
      autorisations
    );
    this.établissementTerritorialRessourcesHumainesMédicoSocialViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
      établissementTerritorial.ressourcesHumaines,
      wording
    );
    this.établissementTerritorialQualiteMédicoSocialViewModel = new ÉtablissementTerritorialQualiteMédicoSocialViewModel(
      wording,
      établissementTerritorial.qualite
    )
  }

  public get titre(): string {
    return `ET - ${this.établissementTerritorialIdentitéMédicoSocialViewModel.numéroFinessÉtablissementTerritorial} - ${this.établissementTerritorialIdentitéMédicoSocialViewModel.nomCourtDeLÉtablissementTerritorial}`;
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

  private formateLeTitreDeLEntitéJuridiqueDeRattachement(): string {
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement.value;
    return `${this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value} - ${nomDeLEntitéJuridique}`;
  }

  public get identitéViewModel(): EtablissementTerritorialMedicoSocialIdentiteViewModel {
    return this.établissementTerritorialIdentitéMédicoSocialViewModel;
  }

  public get activitésViewModel(): ÉtablissementTerritorialMédicoSocialActivitéViewModel {
    return this.établissementTerritorialActivitéMédicoSocialViewModel;
  }

  public get autorisationsViewModel(): ÉtablissementTerritorialMédicoSocialAutorisationsViewModel {
    return this.établissementTerritorialAutorisationsMédicoSocialViewModel;
  }

  public get budgetEtFinancesViewModel(): ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel {
    return this.établissementTerritorialBudgetEtFinancesMédicoSocialViewModel;
  }

  public get ressourcesHumainesViewModel(): ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel {
    return this.établissementTerritorialRessourcesHumainesMédicoSocialViewModel;
  }

  public get qualiteViewModel(): ÉtablissementTerritorialQualiteMédicoSocialViewModel {
    return this.établissementTerritorialQualiteMédicoSocialViewModel;
  }
}
