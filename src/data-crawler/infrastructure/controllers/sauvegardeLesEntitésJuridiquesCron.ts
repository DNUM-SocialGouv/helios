import { SauvegardeLesEntitésJuridiquesUseCase } from '../../métier/use-cases/SauvegardeLesEntitésJuridiquesUseCase'
import { dependencies, Dependencies } from '../dependencies'

async function sauvegardeLesEntitésJuridiquesCron(dependencies: Dependencies) {
  const sauvegardeLesEntitésJuridiques = new SauvegardeLesEntitésJuridiquesUseCase(
    dependencies.entitéJuridiqueLoader,
    dependencies.entitéJuridiqueRepository
  )

  await sauvegardeLesEntitésJuridiques.handle()
  setTimeout(() => process.exit(0), 1000)
}

sauvegardeLesEntitésJuridiquesCron(dependencies)
