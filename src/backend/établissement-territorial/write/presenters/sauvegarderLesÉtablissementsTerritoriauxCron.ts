import { Dependencies, dependencies } from '../../../configuration/dependencies'
import { SauvegarderLesÉtablissementsTerritoriaux } from '../use-cases/SauvegarderLesÉtablissementsTerritoriaux'

async function sauvegarderLesÉtablissementsTerritoriauxCron(dependencies: Dependencies) {
  const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriaux(dependencies.établissementTerritorialFinessLoader)

  console.info(sauvegarderLesÉtablissementsTerritoriaux.handle())
}

sauvegarderLesÉtablissementsTerritoriauxCron(dependencies)
