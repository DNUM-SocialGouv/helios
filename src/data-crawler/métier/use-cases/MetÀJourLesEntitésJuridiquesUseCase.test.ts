import { getFakeDataCrawlerDependencies } from '../../testHelper'
import { MetÀJourLesEntitésJuridiquesUseCase } from './MetÀJourLesEntitésJuridiquesUseCase'

describe('Mise à jour des entités juridiques', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()

  it('récupère les entités juridiques de plusieurs sources de données', async () => {
    // GIVEN
    const sauvegarderLesEntitésJuridiques = new MetÀJourLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader
    )

    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader, 'récupèreLeNuméroFinessDesEntitésJuridiques').mockResolvedValue([])

    // WHEN
    await sauvegarderLesEntitésJuridiques.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes).toHaveBeenCalledWith()
    expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques).toHaveBeenCalledWith()
  })

  it('sauvegarde les entités juridiques de plusieurs sources de données', async () => {
    // GIVEN
    const sauvegarderLesEntitésJuridiques = new MetÀJourLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader
    )
    const entitésJuridiques = [
      {
        adresseAcheminement: '01117 OYONNAX CEDEX',
        adresseNuméroVoie: '1',
        adresseTypeVoie: 'RTE',
        adresseVoie: 'DE VEYZIAT',
        dateMiseAJourSource: '20220203',
        libelléStatutJuridique: 'Etablissement Public Intercommunal dHospitalisation',
        numéroFinessEntitéJuridique: '010018407',
        raisonSociale: 'CH DU HAUT BUGEY',
        téléphone: '0102030406',
      },
      {
        adresseAcheminement: '59650 VILLENEUVE D ASCQ',
        adresseNuméroVoie: '20',
        adresseTypeVoie: 'AV',
        adresseVoie: 'DE LA RECONNAISSANCE',
        dateMiseAJourSource: '20220203',
        libelléStatutJuridique: 'Société Anonyme (S.A.)',
        numéroFinessEntitéJuridique: '590001741',
        raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        téléphone: '0102030405',
      },
    ]
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, 'récupèreLesEntitésJuridiquesOuvertes').mockReturnValue(entitésJuridiques)
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader, 'récupèreLeNuméroFinessDesEntitésJuridiques').mockResolvedValue([])

    // WHEN
    await sauvegarderLesEntitésJuridiques.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.sauvegarde).toHaveBeenCalledWith(entitésJuridiques)
  })

  it('supprime les entités juridiques qui ne sont plus récupérées par les sources externes', async () => {
    // GIVEN
    const sauvegarderLesEntitésJuridiques = new MetÀJourLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader
    )

    const numéroFinessEntitéJuridiqueToujoursOuverte = '010018407'
    const entitésJuridiquesOuvertes = [
      {
        adresseAcheminement: '01117 OYONNAX CEDEX',
        adresseNuméroVoie: '1',
        adresseTypeVoie: 'RTE',
        adresseVoie: 'DE VEYZIAT',
        dateMiseAJourSource: '20220203',
        libelléStatutJuridique: 'Etablissement Public Intercommunal dHospitalisation',
        numéroFinessEntitéJuridique: numéroFinessEntitéJuridiqueToujoursOuverte,
        raisonSociale: 'CH DU HAUT BUGEY',
        téléphone: '0102030406',
      },
    ]
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, 'récupèreLesEntitésJuridiquesOuvertes').mockReturnValue(entitésJuridiquesOuvertes)

    const entitésJuridiquesEnBase = [
      numéroFinessEntitéJuridiqueToujoursOuverte,
      '123456789',
    ]
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader, 'récupèreLeNuméroFinessDesEntitésJuridiques').mockResolvedValue(entitésJuridiquesEnBase)

    // WHEN
    await sauvegarderLesEntitésJuridiques.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.supprime).toHaveBeenCalledWith(['123456789'])
  })
})
