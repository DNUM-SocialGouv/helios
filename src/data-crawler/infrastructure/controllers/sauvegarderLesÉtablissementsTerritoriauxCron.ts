import { SauvegarderLesÉtablissementsTerritoriauxUseCase } from '../../métier/use-cases/SauvegarderLesÉtablissementsTerritoriauxUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function sauvegarderLesÉtablissementsTerritoriauxCron(dependencies: Dependencies) {
  const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(dependencies.finessÉtablissementTerritorialLoader)

  sauvegarderLesÉtablissementsTerritoriaux.handle()
}

sauvegarderLesÉtablissementsTerritoriauxCron(dependencies)
