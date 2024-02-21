import { ÉtablissementTerritorialMédicoSocial } from "../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";
import { ÉtablissementTerritorialMédicoSocialLoader } from "../gateways/ÉtablissementTerritorialMédicoSocialLoader";

export class RécupèreLÉtablissementTerritorialMédicoSocialUseCase {
  constructor(
    private établissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader,
    private entitéJuridiqueLoader: EntitéJuridiqueLoader
  ) { }

  async exécute(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocial> {
    const établissementTerritorialMédicoSocialOuErreur = await this.établissementTerritorialMédicoSocialLoader.chargeIdentité(
      numéroFinessÉtablissementTerritorial
    );

    if (établissementTerritorialMédicoSocialOuErreur instanceof ÉtablissementTerritorialMédicoSocialNonTrouvée) {
      throw établissementTerritorialMédicoSocialOuErreur;
    }

    const { estMonoÉtablissement } = await this.établissementTerritorialMédicoSocialLoader.estUnMonoÉtablissement(
      établissementTerritorialMédicoSocialOuErreur.numéroFinessEntitéJuridique.value
    );

    const entitéJuridiqueDeRattachement = await this.entitéJuridiqueLoader.chargeRattachement(
      établissementTerritorialMédicoSocialOuErreur.numéroFinessEntitéJuridique.value
    );

    const établissementTerritorialMédicoSocialActivité = await this.établissementTerritorialMédicoSocialLoader.chargeActivité(
      numéroFinessÉtablissementTerritorial
    );

    const établissementTerritorialMédicoSocialAutorisation = await this.établissementTerritorialMédicoSocialLoader.chargeAutorisationsEtCapacités(
      numéroFinessÉtablissementTerritorial
    );

    const établissementTerritorialMédicoSocialBudgetEtFinances = await this.établissementTerritorialMédicoSocialLoader.chargeBudgetEtFinances(
      numéroFinessÉtablissementTerritorial
    );

    const établissementTerritorialMédicoSocialRessourcesHumaines = await this.établissementTerritorialMédicoSocialLoader.chargeRessourcesHumaines(
      numéroFinessÉtablissementTerritorial
    );

    const établissementTerritorialMédicoSocialQualite = await this.établissementTerritorialMédicoSocialLoader.chargeQualite(
      numéroFinessÉtablissementTerritorial
    );

    return {
      activités: établissementTerritorialMédicoSocialActivité,
      autorisationsEtCapacités: établissementTerritorialMédicoSocialAutorisation,
      budgetEtFinances: établissementTerritorialMédicoSocialBudgetEtFinances,
      identité: {
        ...établissementTerritorialMédicoSocialOuErreur,
        ...entitéJuridiqueDeRattachement,
        estMonoÉtablissement,
      },
      ressourcesHumaines: établissementTerritorialMédicoSocialRessourcesHumaines,
      qualite: établissementTerritorialMédicoSocialQualite
    };
  }
}
