import { RécupèreLEntitéJuridiqueUseCase } from '../../métier/use-cases/RécupèreLEntitéJuridiqueUseCase'
import { Dependencies } from '../dependencies'

export async function récupèreLEntitéJuridiqueEndpoint(dependencies: Dependencies, numéroFINESS: string) {
  const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(dependencies.entitéJuridiqueLoader)

  return await récupèreLEntitéJuridiqueUseCase.exécute(numéroFINESS)
}
