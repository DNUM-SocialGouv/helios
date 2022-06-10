import { getFakeDataCrawlerDependencies } from '../../testHelper'
import { DomaineÉtablissementTerritorial } from '../entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { SauvegardeLesÉtablissementsTerritoriauxUseCase } from './SauvegardeLesÉtablissementsTerritoriauxUseCase'

describe('Sauvegarde des établissements territoriaux', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()

  it('récupère les établissements territoriaux de plusieurs sources de données', async () => {
    // GIVEN
    const sauvegardeLesÉtablissementsTerritoriaux = new SauvegardeLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader
    )
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader, 'récupèreLeNuméroFinessDesEntitésJuridiques').mockResolvedValue(['123456789'])

    // WHEN
    await sauvegardeLesÉtablissementsTerritoriaux.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader.récupèreLesÉtablissementsTerritoriauxOuverts).toHaveBeenCalledWith(['123456789'])
  })

  it('sauvegarde les établissements territoriaux de plusieurs sources de données', async () => {
    // GIVEN
    const sauvegardeLesÉtablissementsTerritoriaux = new SauvegardeLesÉtablissementsTerritoriauxUseCase(
      fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader,
      fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader
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
    jest.spyOn(fakeDataCrawlerDependencies.établissementTerritorialSourceExterneLoader, 'récupèreLesÉtablissementsTerritoriauxOuverts').mockResolvedValue(établissementsTerritoriaux)

    // WHEN
    await sauvegardeLesÉtablissementsTerritoriaux.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.établissementTerritorialHeliosRepository.sauvegarde).toHaveBeenCalledWith(établissementsTerritoriaux)
  })
})
