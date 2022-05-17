import { SauvegarderLesEntitésJuridiquesUseCase } from '../../métier/use-cases/SauvegarderLesEntitésJuridiquesUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function sauvegarderLesEntitésJuridiquesCron(dependencies: Dependencies) {
  const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiquesUseCase(
    dependencies.finessEntitéJuridiqueLoader,
    dependencies.finessEntitéJuridiqueRepository
  )

  await sauvegarderLesEntitésJuridiques.handle()
  setTimeout(() => process.exit(0), 1000)
}

sauvegarderLesEntitésJuridiquesCron(dependencies)
