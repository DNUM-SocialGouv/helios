import { fakeBackendDependencies } from '../../../../technique/testHelperBackend'
import { SauvegarderLesÉtablissementsTerritoriauxUseCase } from './SauvegarderLesÉtablissementsTerritoriauxUseCase'

describe('Sauvegarde des établissements territoriaux', () => {
  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(fakeBackendDependencies.établissementTerritorialFinessLoader)

    // WHEN
    sauvegarderLesÉtablissementsTerritoriaux.handle()

    // THEN
    expect(fakeBackendDependencies.établissementTerritorialFinessLoader.récupérerLesÉtablissementsTerritoriaux).toHaveBeenCalledWith()
  })
})
