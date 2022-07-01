import { ÉtablissementTerritorialSanitaireIdentité } from '../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireIdentité'
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from '../../métier/use-cases/RécupèreLÉtablissementTerritorialSanitaireUseCase'
import { Dependencies } from '../dependencies'

export async function récupèreLÉtablissementTerritorialSanitaireEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialSanitaire: string
): Promise<ÉtablissementTerritorialSanitaireIdentité | void> {
  try {
    const récupèreLÉtablissementTerritorialSanitaireUseCase =
      new RécupèreLÉtablissementTerritorialSanitaireUseCase(dependencies.établissementTerritorialSanitaireLoader, dependencies.entitéJuridiqueLoader)

    return await récupèreLÉtablissementTerritorialSanitaireUseCase.exécute(numéroFinessÉtablissementTerritorialSanitaire)
  } catch (error) {
    dependencies.logger.error(error)
  }
}
