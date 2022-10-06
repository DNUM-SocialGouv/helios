import { getFakeDataCrawlerDependencies, unÉtablissementMédicoSocial, unÉtablissementSanitaire } from '../../testHelper'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { MetsÀJourLesÉtablissementsTerritoriauxUseCase } from './MetsÀJourLesÉtablissementsTerritoriauxUseCase'

describe('Mise à jour des établissements territoriaux', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()

  it('récupère les établissements territoriaux des sources de données externes avec la date de mise à jour de leur fichier source', async () => {
    // GIVEN
    const sauvegardeLesÉtablissementsTerritoriaux = new MetsÀJourLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader
    )
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader, 'récupèreLaDateDeMiseÀJourDuFichierSource').mockReturnValue('')
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader, 'récupèreLesÉtablissementsTerritoriauxOuverts').mockReturnValue([])
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader, 'récupèreLeNuméroFinessDesEntitésJuridiques').mockResolvedValue(['123456789'])
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader, 'récupèreLeNuméroFinessDesÉtablissementsTerritoriaux').mockResolvedValue([])

    // WHEN
    await sauvegardeLesÉtablissementsTerritoriaux.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader.récupèreLaDateDeMiseÀJourDuFichierSource).toHaveBeenCalledWith()
    expect(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader.récupèreLesÉtablissementsTerritoriauxOuverts).toHaveBeenCalledWith(['123456789'])
  })

  it('sauvegarde les établissements territoriaux des sources de données externes avec la date de mise à jour de leur fichier source', async () => {
    // GIVEN
    const sauvegardeLesÉtablissementsTerritoriaux = new MetsÀJourLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader
    )
    const établissementsTerritoriaux: ÉtablissementTerritorialIdentité[] = [
      unÉtablissementMédicoSocial,
      unÉtablissementSanitaire,
    ]
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader, 'récupèreLaDateDeMiseÀJourDuFichierSource').mockReturnValue('20220728')
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader, 'récupèreLesÉtablissementsTerritoriauxOuverts').mockReturnValue(établissementsTerritoriaux)
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader, 'récupèreLeNuméroFinessDesÉtablissementsTerritoriaux').mockResolvedValue([])

    // WHEN
    await sauvegardeLesÉtablissementsTerritoriaux.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository.sauvegarde).toHaveBeenCalledWith(établissementsTerritoriaux, '20220728')
  })

  it('extrais les établissements territoriaux fermés pour les supprimer', async () => {
    // GIVEN
    const sauvegardeLesÉtablissementsTerritoriaux = new MetsÀJourLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader
    )

    const numéroFinessÉtablissementTerritorialToujoursOuvert = '010018407'
    const établissementTerritorialOuvert: ÉtablissementTerritorialIdentité[] = [
      {
        ...unÉtablissementMédicoSocial,
        numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorialToujoursOuvert,
      },
    ]
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader, 'récupèreLesÉtablissementsTerritoriauxOuverts').mockReturnValue(établissementTerritorialOuvert)

    const numérosFinessDesÉtablissementsEnBase = [
      numéroFinessÉtablissementTerritorialToujoursOuvert,
      '123456789',
    ]
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader, 'récupèreLeNuméroFinessDesÉtablissementsTerritoriaux').mockResolvedValue(numérosFinessDesÉtablissementsEnBase)

    // WHEN
    await sauvegardeLesÉtablissementsTerritoriaux.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository.supprime).toHaveBeenCalledWith(['123456789'])
  })

  it('signale une alerte si la récupération des entités juridiques échoue', async () => {
    // GIVEN
    const messageDerreur = 'téléchargement interrompu'
    const sauvegardeLesÉtablissementsTerritoriaux = new MetsÀJourLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader
    )

    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader, 'récupèreLesÉtablissementsTerritoriauxOuverts').mockImplementation(() => {
      throw new Error(messageDerreur)
    })

    try {
      // WHEN
      await sauvegardeLesÉtablissementsTerritoriaux.exécute()
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${messageDerreur}`)
    }
  })
})
