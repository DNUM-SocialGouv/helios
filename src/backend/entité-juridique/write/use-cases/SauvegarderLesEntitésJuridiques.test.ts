import { fakeDependencies } from '../../../../../tests/testHelper'
import { SauvegarderLesEntitésJuridiques } from './SauvegarderLesEntitésJuridiques'

describe('Sauvegarde des entités juridiques', () => {
  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiques(fakeDependencies.entitésJuridiquesFinessLoader)

    // WHEN
    sauvegarderLesEntitésJuridiques.handle()

    // THEN
    expect(fakeDependencies.entitésJuridiquesFinessLoader.récupérerLesEntitésJuridiques).toHaveBeenCalledWith()
  })
})
