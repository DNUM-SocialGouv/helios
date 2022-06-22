import { getFakeDataCrawlerDependencies } from '../../testHelper'
import { DomaineÉtablissementTerritorial } from '../entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { MetsÀJourLesÉtablissementsTerritoriauxUseCase } from './MetsÀJourLesÉtablissementsTerritoriauxUseCase'

describe('Mise à jour des établissements territoriaux', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()

  it('récupère les établissements territoriaux des sources de données externes', async () => {
    // GIVEN
    const sauvegardeLesÉtablissementsTerritoriaux = new MetsÀJourLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader
    )
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader, 'récupèreLesÉtablissementsTerritoriauxOuverts').mockReturnValue([])
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader, 'récupèreLeNuméroFinessDesEntitésJuridiques').mockResolvedValue(['123456789'])
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader, 'récupèreLeNuméroFinessDesÉtablissementsTerritoriaux').mockResolvedValue([])

    // WHEN
    await sauvegardeLesÉtablissementsTerritoriaux.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader.récupèreLesÉtablissementsTerritoriauxOuverts).toHaveBeenCalledWith(['123456789'])
  })

  it('sauvegarde les établissements territoriaux des sources de données externes', async () => {
    // GIVEN
    const sauvegardeLesÉtablissementsTerritoriaux = new MetsÀJourLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader
    )
    const établissementsTerritoriaux: ÉtablissementTerritorialIdentité[] = [
      {
        adresseAcheminement: '01130 NANTUA',
        adresseNuméroVoie: '50',
        adresseTypeVoie: 'R',
        adresseVoie: 'PAUL PAINLEVE',
        catégorieÉtablissement: '355',
        courriel: 'a@example.com',
        dateMiseAJourSource: '20220203',
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
        numéroFinessEntitéJuridique: '010018407',
        numéroFinessÉtablissementPrincipal: '010000057',
        numéroFinessÉtablissementTerritorial: '010000040',
        raisonSociale: 'CH NANTUA',
        typeÉtablissement: 'S',
        téléphone: '0102030405',
      },
      {
        adresseAcheminement: '59650 VILLENEUVE D ASCQ',
        adresseNuméroVoie: '20',
        adresseTypeVoie: 'AV',
        adresseVoie: 'DE LA RECONNAISSANCE',
        catégorieÉtablissement: '365',
        courriel: 'b@example.com',
        dateMiseAJourSource: '20220203',
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
        numéroFinessEntitéJuridique: '590000741',
        numéroFinessÉtablissementPrincipal: '',
        numéroFinessÉtablissementTerritorial: '590782553',
        raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        typeÉtablissement: 'P',
        téléphone: '0102030406',
      },
    ]
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader, 'récupèreLesÉtablissementsTerritoriauxOuverts').mockReturnValue(établissementsTerritoriaux)
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialHeliosLoader, 'récupèreLeNuméroFinessDesÉtablissementsTerritoriaux').mockResolvedValue([])

    // WHEN
    await sauvegardeLesÉtablissementsTerritoriaux.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository.sauvegarde).toHaveBeenCalledWith(établissementsTerritoriaux)
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
    const établissementTerritorialOuvert = [
      {
        adresseAcheminement: '01130 NANTUA',
        adresseNuméroVoie: '50',
        adresseTypeVoie: 'R',
        adresseVoie: 'PAUL PAINLEVE',
        catégorieÉtablissement: '355',
        courriel: 'a@example.com',
        dateMiseAJourSource: '20220203',
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
        numéroFinessEntitéJuridique: '010018407',
        numéroFinessÉtablissementPrincipal: '010000057',
        numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorialToujoursOuvert,
        raisonSociale: 'CH NANTUA',
        typeÉtablissement: 'S',
        téléphone: '0102030405',
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
