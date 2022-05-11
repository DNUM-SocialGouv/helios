import { fakeDataCrawlerDependencies } from '../../testHelper'
import { SauvegarderLesEntitésJuridiquesUseCase } from './SauvegarderLesEntitésJuridiquesUseCase'

describe('Sauvegarde des entités juridiques', () => {
  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiquesUseCase(fakeDataCrawlerDependencies.finessEntitéJuridiqueLoader)

    // WHEN
    sauvegarderLesEntitésJuridiques.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.finessEntitéJuridiqueLoader.récupérerLesEntitésJuridiques).toHaveBeenCalledWith()
  })
})
