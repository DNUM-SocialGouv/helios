import { fakeBackendDependencies } from '../../../../technique/testHelperBackend'
import { SauvegarderLesEntitésJuridiquesUseCase } from './SauvegarderLesEntitésJuridiquesUseCase'

describe('Sauvegarde des entités juridiques', () => {
  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiquesUseCase(fakeBackendDependencies.entitésJuridiquesFinessLoader)

    // WHEN
    sauvegarderLesEntitésJuridiques.handle()

    // THEN
    expect(fakeBackendDependencies.entitésJuridiquesFinessLoader.récupérerLesEntitésJuridiques).toHaveBeenCalledWith()
  })
})
