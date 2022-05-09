import { fakeDependencies } from '../../../../../tests/testHelper'
import { SauvegarderLesÉtablissementsTerritoriaux } from './SauvegarderLesÉtablissementsTerritoriaux'

describe('Sauvegarde des établissements territoriaux', () => {
  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriaux(fakeDependencies.établissementTerritorialFinessLoader)

    // WHEN
    sauvegarderLesÉtablissementsTerritoriaux.handle()

    // THEN
    expect(fakeDependencies.établissementTerritorialFinessLoader.récupérerLesÉtablissementsTerritoriaux).toHaveBeenCalledWith()
  })
})
