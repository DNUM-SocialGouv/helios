import { ReactElement } from "react";

import { ÉtablissementTerritorialMédicoSocial } from "../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { Paths } from "../../configuration/Paths";
import { Wording } from "../../configuration/wording/Wording";
import { ÉtablissementTerritorialMédicoSocialActivitéViewModel } from "./bloc-activité/ÉtablissementTerritorialMédicoSocialActivitéViewModel";
import { ÉtablissementTerritorialMédicoSocialAutorisationsViewModel } from "./bloc-autorisations/ÉtablissementTerritorialMédicoSocialAutorisationsViewModel";
import { ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel } from "./bloc-budget-et-finances/ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel";
import { ÉtablissementTerritorialMédicoSocialIdentitéViewModel } from "./bloc-identité/ÉtablissementTerritorialMédicoSocialIdentitéViewModel";
import { ÉtablissementTerritorialQualiteMédicoSocialViewModel } from "./bloc-qualite/ÉtablissementTerritorialQualiteMédicoSocialViewModel";
import { BlocVigieRHViewModel } from "./bloc-ressources-humaines/bloc-vigie-rh/BlocVigieRHViewModel";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "./bloc-ressources-humaines/ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";

export class ÉtablissementTerritorialMédicoSocialViewModel {
  private établissementTerritorialIdentitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialIdentitéViewModel;
  private établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
  private établissementTerritorialAutorisationsMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialAutorisationsViewModel;
  private établissementTerritorialBudgetEtFinancesMédicoSocialViewModel: ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel;
  private établissementTerritorialRessourcesHumainesMédicoSocialViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel;
  private établissementTerritorialQualiteMédicoSocialViewModel: ÉtablissementTerritorialQualiteMédicoSocialViewModel;
  private blocVigieRHViewModel: BlocVigieRHViewModel;
  public autorisations: any;

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialMédicoSocial, private readonly wording: Wording, paths: Paths, autorisations: any) {
    this.établissementTerritorialIdentitéMédicoSocialViewModel = new ÉtablissementTerritorialMédicoSocialIdentitéViewModel(
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
    );
    this.blocVigieRHViewModel = new BlocVigieRHViewModel(établissementTerritorial.vigieRh, wording);
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

  public get identitéViewModel(): ÉtablissementTerritorialMédicoSocialIdentitéViewModel {
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

  public get vigieRHViewModel(): BlocVigieRHViewModel {
    return this.blocVigieRHViewModel;
  }
}
