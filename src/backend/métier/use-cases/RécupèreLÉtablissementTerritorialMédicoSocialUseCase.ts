import { ÉtablissementTerritorialMédicoSocial } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialMédicoSocialLoader } from '../gateways/ÉtablissementTerritorialMédicoSocialLoader'

export class RécupèreLÉtablissementTerritorialMédicoSocialUseCase {
  constructor(
    private établissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader,
    private entitéJuridiqueLoader: EntitéJuridiqueLoader
  ) {}

  async exécute(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocial> {
    const établissementTerritorialMédicoSocialOuErreur =
      await this.établissementTerritorialMédicoSocialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

    if (établissementTerritorialMédicoSocialOuErreur instanceof ÉtablissementTerritorialMédicoSocialNonTrouvée) {
      throw établissementTerritorialMédicoSocialOuErreur
    }

    const { estMonoÉtablissement } = await this.établissementTerritorialMédicoSocialLoader.estUnMonoÉtablissement(numéroFinessÉtablissementTerritorial)

    const entitéJuridiqueDeRattachement = await this.entitéJuridiqueLoader.chargeLEntitéJuridiqueDeRattachement(
      établissementTerritorialMédicoSocialOuErreur.numéroFinessEntitéJuridique
    )

    const établissementTerritorialMédicoSocialActivitéOuErreur =
      await this.établissementTerritorialMédicoSocialLoader.chargeActivité(numéroFinessÉtablissementTerritorial)

    return {
      activités: établissementTerritorialMédicoSocialActivitéOuErreur,
      identité: {
        ...établissementTerritorialMédicoSocialOuErreur,
        ...entitéJuridiqueDeRattachement,
        estMonoÉtablissement,
      },
    }
  }
}
