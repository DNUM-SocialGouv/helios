import { RésultatDeRecherche } from '../../métier/entities/RésultatDeRecherche'
import { RechercheParmiLesEntitésEtÉtablissementsUseCase } from '../../métier/use-cases/RechercheParmiLesEntitésEtÉtablissementsUseCase'
import { Dependencies } from '../dependencies'

export async function rechercheEndpoint(dependencies: Dependencies, terme: string): Promise<RésultatDeRecherche[]> {
  try {
    const rechercheParmiLesEntitésEtÉtablissementsUseCase = new RechercheParmiLesEntitésEtÉtablissementsUseCase(
      dependencies.rechercheLoader
    )

    return await rechercheParmiLesEntitésEtÉtablissementsUseCase.exécute(terme)
  } catch (error) {
    dependencies.logger.error(error)
    throw error
  }
}
