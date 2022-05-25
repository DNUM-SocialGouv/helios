import { ÉtablissementTerritorialIdentité } from '../../métier/entities/ÉtablissementTerritorialIdentité'
import { RécupèreLÉtablissementTerritorialUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialUseCase'
import { Dependencies } from '../dependencies'

export async function récupèreLÉtablissementTerritorialEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorial: string
): Promise<ÉtablissementTerritorialIdentité> {
  const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialUseCase(dependencies.établissementTerritorial)

  return await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial)
}
