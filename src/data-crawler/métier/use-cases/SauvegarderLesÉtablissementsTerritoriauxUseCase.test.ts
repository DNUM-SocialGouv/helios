import { fakeDataCrawlerDependencies } from '../../testHelper'
import { SauvegarderLesÉtablissementsTerritoriauxUseCase } from './SauvegarderLesÉtablissementsTerritoriauxUseCase'

describe('Sauvegarde des établissements territoriaux', () => {
  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.finessÉtablissementTerritorialLoader
    )

    // WHEN
    sauvegarderLesÉtablissementsTerritoriaux.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.finessÉtablissementTerritorialLoader.récupérerLesÉtablissementsTerritoriaux).toHaveBeenCalledWith()
  })
})
