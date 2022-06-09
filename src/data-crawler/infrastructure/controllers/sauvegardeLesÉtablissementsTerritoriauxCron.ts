import { SauvegardeLesÉtablissementsTerritoriauxUseCase } from '../../métier/use-cases/SauvegardeLesÉtablissementsTerritoriauxUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function sauvegardeLesÉtablissementsTerritoriauxCron(dependencies: Dependencies) {
  const sauvegardeLesÉtablissementsTerritoriaux = new SauvegardeLesÉtablissementsTerritoriauxUseCase(
    dependencies.établissementTerritorialSourceExterneLoader,
    dependencies.établissementTerritorialHeliosRepository,
    dependencies.entitéJuridiqueHeliosLoader
  )

  await sauvegardeLesÉtablissementsTerritoriaux.exécute()
  setTimeout(() => process.exit(0), 1000)
}

sauvegardeLesÉtablissementsTerritoriauxCron(dependencies)
