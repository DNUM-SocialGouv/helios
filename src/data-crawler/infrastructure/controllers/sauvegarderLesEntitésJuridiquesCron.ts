import { SauvegarderLesEntitésJuridiquesUseCase } from '../../métier/use-cases/SauvegarderLesEntitésJuridiquesUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function sauvegarderLesEntitésJuridiquesCron(dependencies: Dependencies) {
  const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiquesUseCase(dependencies.finessEntitéJuridiqueLoader)

  sauvegarderLesEntitésJuridiques.handle()
}

sauvegarderLesEntitésJuridiquesCron(dependencies)
