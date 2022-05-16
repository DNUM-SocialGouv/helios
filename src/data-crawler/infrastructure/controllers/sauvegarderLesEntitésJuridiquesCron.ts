import { SauvegarderLesEntitésJuridiquesUseCase } from '../../métier/use-cases/SauvegarderLesEntitésJuridiquesUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function sauvegarderLesEntitésJuridiquesCron(initDependencies: Promise<Dependencies>) {
  const dependencies = await initDependencies
  const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiquesUseCase(
    dependencies.finessEntitéJuridiqueLoader,
    dependencies.finessEntitéJuridiqueRepository
  )

  await sauvegarderLesEntitésJuridiques.handle()
  setTimeout(() => process.exit(0), 1000)
}

sauvegarderLesEntitésJuridiquesCron(dependencies)
