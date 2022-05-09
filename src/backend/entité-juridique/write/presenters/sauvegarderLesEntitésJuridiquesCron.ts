import { Dependencies, dependencies } from '../../../configuration/dependencies'
import { SauvegarderLesEntitésJuridiques } from '../use-cases/SauvegarderLesEntitésJuridiques'

async function sauvegarderLesEntitésJuridiquesCron(dependencies: Dependencies) {
  const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiques(dependencies.entitésJuridiquesFinessLoader)

  console.info(sauvegarderLesEntitésJuridiques.handle())
}

sauvegarderLesEntitésJuridiquesCron(dependencies)
