import { ÉtablissementTerritorialMédicoSocialActivité } from '../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialMédicoSocialIdentité } from '../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialIdentité'
import { RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase'
import { RécupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase'
import { Dependencies } from '../dependencies'

type ÉtablissementTerritorialMédicoSocial = Readonly<{
  activité: ÉtablissementTerritorialMédicoSocialActivité[]
  identité: ÉtablissementTerritorialMédicoSocialIdentité
}>

export async function récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialMédicoSocial: string
): Promise<ÉtablissementTerritorialMédicoSocial> {
  const récupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase(
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
}
