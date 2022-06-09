import { MetsÀJourLesEntitésJuridiquesUseCase } from '../../métier/use-cases/MetsÀJourLesEntitésJuridiquesUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function metsÀJourLesEntitésJuridiquesCron(dependencies: Dependencies) {
  const metsÀJourLesEntitésJuridiquesUseCase = new MetsÀJourLesEntitésJuridiquesUseCase(
    dependencies.entitéJuridiqueSourceExterneLoader,
    dependencies.entitéJuridiqueHeliosRepository,
    dependencies.entitéJuridiqueHeliosLoader
  )

  await metsÀJourLesEntitésJuridiquesUseCase.exécute()
  setTimeout(() => process.exit(0), 1000)
}

metsÀJourLesEntitésJuridiquesCron(dependencies)
