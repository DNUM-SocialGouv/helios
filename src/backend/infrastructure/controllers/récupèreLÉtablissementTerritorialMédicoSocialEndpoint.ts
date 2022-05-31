import { ÉtablissementTerritorialMédicoSocialIdentité } from '../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialIdentité'
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialMédicoSocialUseCase'
import { Dependencies } from '../dependencies'

export async function récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialMédicoSocial: string
): Promise<ÉtablissementTerritorialMédicoSocialIdentité> {
  const récupèreLÉtablissementTerritorialMédicoSocialUseCase =
    new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(dependencies.établissementTerritorialMédicoSocialLoader, dependencies.entitéJuridiqueLoader)

  return await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorialMédicoSocial)
}
