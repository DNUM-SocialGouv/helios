import { Dependencies } from '../../infrastructure/dependencies'
import { getFakeDataCrawlerDependencies } from '../../testHelper'
import { SauvegarderLesÉtablissementsTerritoriauxUseCase } from './SauvegarderLesÉtablissementsTerritoriauxUseCase'

describe('Sauvegarde des établissements territoriaux', () => {
  let fakeDataCrawlerDependencies: Dependencies

  beforeAll(async () => {
    fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies()
  })

  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.finessÉtablissementTerritorialLoader,
      fakeDataCrawlerDependencies.finessÉtablissementTerritorialRepository
    )

    // WHEN
    sauvegarderLesÉtablissementsTerritoriaux.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.finessÉtablissementTerritorialLoader.récupérerLesÉtablissementsTerritoriaux).toHaveBeenCalledWith()
  })

  it('sauvegarder les établissements territoriaux de plusieurs sources de données', async () => {
    const sauvegarderLesÉtablissementsTerritoriaux = new SauvegarderLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.finessÉtablissementTerritorialLoader,
      fakeDataCrawlerDependencies.finessÉtablissementTerritorialRepository
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
    jest.spyOn(fakeDataCrawlerDependencies.finessÉtablissementTerritorialLoader, 'récupérerLesÉtablissementsTerritoriaux').mockReturnValue(établissementsTerritoriaux)

    // WHEN
    await sauvegarderLesÉtablissementsTerritoriaux.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.finessÉtablissementTerritorialRepository.save).toHaveBeenCalledWith(établissementsTerritoriaux)
  })
})
