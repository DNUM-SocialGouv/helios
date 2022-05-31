import { ÉtablissementTerritorialMédicoSocialIdentité } from '../../métier/entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocialIdentité'
import { RécupèreLÉtablissementTerritorialUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialUseCase'
import { Dependencies } from '../dependencies'

export async function récupèreLÉtablissementTerritorialEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorial: string
): Promise<ÉtablissementTerritorialMédicoSocialIdentité> {
  const récupèreLÉtablissementTerritorialUseCase =
    new RécupèreLÉtablissementTerritorialUseCase(dependencies.établissementTerritorialLoader, dependencies.entitéJuridiqueLoader)

  return await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial)
}
