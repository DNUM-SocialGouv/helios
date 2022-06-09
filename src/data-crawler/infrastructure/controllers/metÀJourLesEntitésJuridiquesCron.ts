import { MetÀJourLesEntitésJuridiquesUseCase } from '../../métier/use-cases/MetÀJourLesEntitésJuridiquesUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function metÀJourLesEntitésJuridiquesCron(dependencies: Dependencies) {
  const metÀJourLesEntitésJuridiquesUseCase = new MetÀJourLesEntitésJuridiquesUseCase(
    dependencies.entitéJuridiqueSourceExterneLoader,
    dependencies.entitéJuridiqueHeliosRepository,
    dependencies.entitéJuridiqueHeliosLoader
  )

  await metÀJourLesEntitésJuridiquesUseCase.exécute()
  setTimeout(() => process.exit(0), 1000)
}

metÀJourLesEntitésJuridiquesCron(dependencies)
