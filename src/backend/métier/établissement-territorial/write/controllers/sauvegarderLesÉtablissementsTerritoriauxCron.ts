import { dependencies, Dependencies } from '../../../../technique/configuration/dependencies'
import { SauvegarderLesÉtablissementsTerritoriauxUseCase } from '../use-cases/SauvegarderLesÉtablissementsTerritoriauxUseCase'

async function sauvegarderLesÉtablissementsTerritoriauxCron(dependencies: Dependencies) {
  const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(dependencies.établissementTerritorialFinessLoader)

  console.info(sauvegarderLesÉtablissementsTerritoriaux.handle())
}

sauvegarderLesÉtablissementsTerritoriauxCron(dependencies)
