import { ÉtablissementTerritorialMédicoSocial } from '../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase'
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialMédicoSocialUseCase'
import { Dependencies } from '../dependencies'

type ÉtablissementTerritorialMédicoSocial = Readonly<{
  activité: ÉtablissementTerritorialMédicoSocialActivité[]
  identité: ÉtablissementTerritorialMédicoSocial
}>

export async function récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialMédicoSocial: string
): Promise<ÉtablissementTerritorialMédicoSocial | void> {
  try {
    const récupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      dependencies.établissementTerritorialMédicoSocialLoader,
      dependencies.entitéJuridiqueLoader
    )

    const établissementTerritorialMédicoSocialIdentité =
      await récupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase.exécute(numéroFinessÉtablissementTerritorialMédicoSocial)

    const récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase(dependencies.établissementTerritorialMédicoSocialLoader)

    const établissementTerritorialMédicoSocialActivité =
      await récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase.exécute(numéroFinessÉtablissementTerritorialMédicoSocial)

    return {
      activité: établissementTerritorialMédicoSocialActivité,
      identité: établissementTerritorialMédicoSocialIdentité,
    }
  } catch (error) {
    dependencies.logger.error(error)
  }
}
