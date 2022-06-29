import { ÉtablissementTerritorialMédicoSocial } from '../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialMédicoSocialUseCase'
import { Dependencies } from '../dependencies'

export async function récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialMédicoSocial: string
): Promise<ÉtablissementTerritorialMédicoSocial | void> {
  try {
    const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
      dependencies.établissementTerritorialMédicoSocialLoader,
      dependencies.entitéJuridiqueLoader
    )

    const établissementTerritorialMédicoSocialIdentité =
      await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorialMédicoSocial)

    return établissementTerritorialMédicoSocialIdentité
  } catch (error) {
    dependencies.logger.error(error)
  }
}
