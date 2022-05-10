import { SauvegarderLesÉtablissementsTerritoriauxUseCase } from '../../métier/use-cases/SauvegarderLesÉtablissementsTerritoriauxUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function sauvegarderLesÉtablissementsTerritoriauxCron(dependencies: Dependencies) {
  const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(dependencies.établissementTerritorialFinessLoader)

  sauvegarderLesÉtablissementsTerritoriaux.handle()
}

sauvegarderLesÉtablissementsTerritoriauxCron(dependencies)
