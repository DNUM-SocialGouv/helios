import { fakeDataCrawlerDependencies } from '../../testHelper'
import { SauvegarderLesEntitésJuridiquesUseCase } from './SauvegarderLesEntitésJuridiquesUseCase'

describe('Sauvegarde des entités juridiques', () => {
  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiquesUseCase(fakeDataCrawlerDependencies.entitésJuridiquesFinessLoader)

    // WHEN
    sauvegarderLesEntitésJuridiques.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.entitésJuridiquesFinessLoader.récupérerLesEntitésJuridiques).toHaveBeenCalledWith()
  })
})
