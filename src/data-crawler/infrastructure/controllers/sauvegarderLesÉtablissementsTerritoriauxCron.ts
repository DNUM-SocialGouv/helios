import { SauvegarderLesÉtablissementsTerritoriauxUseCase } from '../../métier/use-cases/SauvegarderLesÉtablissementsTerritoriauxUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function sauvegarderLesÉtablissementsTerritoriauxCron(dependencies: Dependencies) {
  const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(
    dependencies.finessÉtablissementTerritorialLoader,
    dependencies.finessÉtablissementTerritorialRepository
  )

  await sauvegarderLesÉtablissementsTerritoriaux.handle()
  setTimeout(() => process.exit(0), 1000)
}

sauvegarderLesÉtablissementsTerritoriauxCron(dependencies)
