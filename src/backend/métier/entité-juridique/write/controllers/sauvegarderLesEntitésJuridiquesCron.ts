import { dependencies, Dependencies } from '../../../../technique/configuration/dependencies'
import { SauvegarderLesEntitésJuridiquesUseCase } from '../use-cases/SauvegarderLesEntitésJuridiquesUseCase'

async function sauvegarderLesEntitésJuridiquesCron(dependencies: Dependencies) {
  const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiquesUseCase(dependencies.entitésJuridiquesFinessLoader)

  console.info(sauvegarderLesEntitésJuridiques.handle())
}

sauvegarderLesEntitésJuridiquesCron(dependencies)
