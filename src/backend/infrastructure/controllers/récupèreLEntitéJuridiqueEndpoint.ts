import { EntitéJuridique } from '../../métier/entities/entité-juridique/EntitéJuridique'
import { ÉtablissementTerritorialRattaché } from '../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { RécupèreLEntitéJuridiqueUseCase } from '../../métier/use-cases/RécupèreLEntitéJuridiqueUseCase'
import { RécupèreLesÉtablissementsTerritoriauxRattachésUseCase } from '../../métier/use-cases/RécupèreLesÉtablissementsTerritoriauxRattachésÀLEntitéJuridique'
import { Dependencies } from '../dependencies'

export async function récupèreLEntitéJuridiqueEndpoint(
  dependencies: Dependencies,
  numéroFiness: string
):
  Promise<{ entitéJuridique: EntitéJuridique, établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[] }> {
  const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(dependencies.entitéJuridiqueLoader)
  const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFiness)

  const récupèreLesÉtablissementsTerritoriauxRattachésUseCase =
    new RécupèreLesÉtablissementsTerritoriauxRattachésUseCase(dependencies.établissementTerritorialRattachéLoader)
  const établissementsTerritoriauxRattachés = await récupèreLesÉtablissementsTerritoriauxRattachésUseCase.exécute(numéroFiness)

  return { entitéJuridique, établissementsTerritoriauxRattachés }
}
