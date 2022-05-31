import { ÉtablissementTerritorialSanitaireIdentité } from '../../métier/entities/ÉtablissementTerritorialSanitaire/ÉtablissementTerritorialSanitaireIdentité'
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialSanitaireUseCase'
import { Dependencies } from '../dependencies'

export async function récupèreLÉtablissementTerritorialSanitaireEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialSanitaire: string
): Promise<ÉtablissementTerritorialSanitaireIdentité> {
  const récupèreLÉtablissementTerritorialSanitaireUseCase =
    new RécupèreLÉtablissementTerritorialSanitaireUseCase(dependencies.établissementTerritorialSanitaireLoader, dependencies.entitéJuridiqueLoader)

  return await récupèreLÉtablissementTerritorialSanitaireUseCase.exécute(numéroFinessÉtablissementTerritorialSanitaire)
}
