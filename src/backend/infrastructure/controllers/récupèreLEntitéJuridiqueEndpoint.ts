import { EntitéJuridique } from '../../métier/entities/entité-juridique/EntitéJuridique'
import { ÉtablissementTerritorialRattaché } from '../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { RécupèreLEntitéJuridiqueUseCase } from '../../métier/use-cases/RécupèreLEntitéJuridiqueUseCase'
import { RécupèreLesÉtablissementsTerritoriauxRattachésUseCase } from '../../métier/use-cases/RécupèreLesÉtablissementsTerritoriauxRattachésÀLEntitéJuridiqueUseCase'
import { Dependencies } from '../dependencies'

type EntitéJuridiqueEndpoint = Readonly<{
  entitéJuridique: EntitéJuridique
  établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[]
}>

export async function récupèreLEntitéJuridiqueEndpoint(
  dependencies: Dependencies,
  numéroFiness: string
): Promise<EntitéJuridiqueEndpoint | void> {
  const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(dependencies.entitéJuridiqueLoader)
  const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFiness)

  const récupèreLesÉtablissementsTerritoriauxRattachésUseCase =
    new RécupèreLesÉtablissementsTerritoriauxRattachésUseCase(dependencies.établissementTerritorialRattachéLoader)
  const établissementsTerritoriauxRattachés = await récupèreLesÉtablissementsTerritoriauxRattachésUseCase.exécute(numéroFiness)

  return { entitéJuridique, établissementsTerritoriauxRattachés }
}
