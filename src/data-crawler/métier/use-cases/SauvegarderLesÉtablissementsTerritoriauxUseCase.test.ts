import { getFakeDataCrawlerDependencies } from '../../testHelper'
import { SauvegarderLesÉtablissementsTerritoriauxUseCase } from './SauvegarderLesÉtablissementsTerritoriauxUseCase'

describe('Sauvegarde des établissements territoriaux', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()

  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    // GIVEN
    const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialLoader,
      fakeDataCrawlerDependencies.établissementTerritorialRepository
    )

    // WHEN
    sauvegarderLesÉtablissementsTerritoriaux.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.établissementTerritorialLoader.récupérerLesÉtablissementsTerritoriaux).toHaveBeenCalledWith()
  })

  it('sauvegarder les établissements territoriaux de plusieurs sources de données', async () => {
    // GIVEN
    const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialLoader,
      fakeDataCrawlerDependencies.établissementTerritorialRepository
    )
    const établissementsTerritoriaux = [
      {
        adresseAcheminement: '01130 NANTUA',
        adresseNuméroVoie: '50',
        adresseTypeVoie: 'R',
        adresseVoie: 'PAUL PAINLEVE',
        catégorieÉtablissement: '355',
        courriel: 'a@example.com',
        dateMiseAJourSource: '20220203',
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
        numéroFinessEntitéJuridique: '590000741',
        numéroFinessÉtablissementPrincipal: '',
        numéroFinessÉtablissementTerritorial: '590782553',
        raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        typeÉtablissement: 'P',
        téléphone: '0102030406',
      },
    ]
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialLoader, 'récupérerLesÉtablissementsTerritoriaux').mockReturnValue(établissementsTerritoriaux)

    // WHEN
    await sauvegarderLesÉtablissementsTerritoriaux.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.établissementTerritorialRepository.save).toHaveBeenCalledWith(établissementsTerritoriaux)
  })
})
