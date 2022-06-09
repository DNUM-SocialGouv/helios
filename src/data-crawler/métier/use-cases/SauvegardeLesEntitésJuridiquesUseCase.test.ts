import { getFakeDataCrawlerDependencies } from '../../testHelper'
import { SauvegardeLesEntitésJuridiquesUseCase } from './SauvegardeLesEntitésJuridiquesUseCase'

describe('Sauvegarde des entités juridiques', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()

  it('récupére les entités juridiques de plusieurs sources de données', async () => {
    // GIVEN
    const sauvegarderLesEntitésJuridiques = new SauvegardeLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueRepository
    )

    // WHEN
    await sauvegarderLesEntitésJuridiques.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueLoader.récupèreLesEntitésJuridiquesOuvertes).toHaveBeenCalledWith()
  })

  it('sauvegarde les entités juridiques de plusieurs sources de données', async () => {
    // GIVEN
    const sauvegarderLesEntitésJuridiques = new SauvegardeLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueRepository
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
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueLoader, 'récupèreLesEntitésJuridiquesOuvertes').mockReturnValue(entitésJuridiques)

    // WHEN
    await sauvegarderLesEntitésJuridiques.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueRepository.sauvegarde).toHaveBeenCalledWith(entitésJuridiques)
  })
})
