import { Dependencies } from '../../infrastructure/dependencies'
import { getFakeDataCrawlerDependencies } from '../../testHelper'
import { SauvegarderLesEntitésJuridiquesUseCase } from './SauvegarderLesEntitésJuridiquesUseCase'

describe('Sauvegarde des entités juridiques', () => {
  let fakeDataCrawlerDependencies: Dependencies

  beforeAll(async () => {
    fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies()
  })

  it('récupérer les entités juridiques de plusieurs sources de données', async () => {
    const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.finessEntitéJuridiqueLoader,
      fakeDataCrawlerDependencies.finessEntitéJuridiqueRepository
    )

    // WHEN
    await sauvegarderLesEntitésJuridiques.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.finessEntitéJuridiqueLoader.récupérerLesEntitésJuridiques).toHaveBeenCalledWith()
  })

  it('sauvegarder les entités juridiques de plusieurs sources de données', async () => {
    const sauvegarderLesEntitésJuridiques = new SauvegarderLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.finessEntitéJuridiqueLoader,
      fakeDataCrawlerDependencies.finessEntitéJuridiqueRepository
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
    jest.spyOn(fakeDataCrawlerDependencies.finessEntitéJuridiqueLoader, 'récupérerLesEntitésJuridiques').mockReturnValue(entitésJuridiques)

    // WHEN
    await sauvegarderLesEntitésJuridiques.handle()

    // THEN
    expect(fakeDataCrawlerDependencies.finessEntitéJuridiqueRepository.save).toHaveBeenCalledWith(entitésJuridiques)
  })
})
