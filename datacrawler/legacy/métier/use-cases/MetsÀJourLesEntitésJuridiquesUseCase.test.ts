import { getFakeDataCrawlerDependencies, uneEntitéJuridique, uneSecondeEntitéJuridique } from '../../testHelper'
import { MetsÀJourLesEntitésJuridiquesUseCase } from './MetsÀJourLesEntitésJuridiquesUseCase'

describe('Mise à jour des entités juridiques', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()

  it('récupère les entités juridiques des sources de données externes avec la date de mise à jour de leur fichier source', async () => {
    // GIVEN
    const sauvegarderLesEntitésJuridiques = new MetsÀJourLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader
    )

    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, 'récupèreLaDateDeMiseÀJourDuFichierSource').mockReturnValue('')
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, 'récupèreLesEntitésJuridiquesOuvertes').mockReturnValue([])
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader, 'récupèreLeNuméroFinessDesEntitésJuridiques').mockResolvedValue([])

    // WHEN
    await sauvegarderLesEntitésJuridiques.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader.récupèreLaDateDeMiseÀJourDuFichierSource).toHaveBeenCalledWith()
    expect(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes).toHaveBeenCalledWith()
    expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques).toHaveBeenCalledWith()
  })

  it('sauvegarde les entités juridiques des sources de données externes avec la date de mise à jour de leur fichier source', async () => {
    // GIVEN
    const sauvegarderLesEntitésJuridiques = new MetsÀJourLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader
    )
    const entitésJuridiques = [
      uneEntitéJuridique,
      uneSecondeEntitéJuridique,
    ]
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, 'récupèreLaDateDeMiseÀJourDuFichierSource').mockReturnValue('20200101')
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, 'récupèreLesEntitésJuridiquesOuvertes').mockReturnValue(entitésJuridiques)
    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader, 'récupèreLeNuméroFinessDesEntitésJuridiques').mockResolvedValue([])

    // WHEN
    await sauvegarderLesEntitésJuridiques.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository.sauvegarde).toHaveBeenCalledWith(entitésJuridiques, '20200101')
  })

  it('extrais les entités juridiques qui ont fermé pour les supprimer', async () => {
    // GIVEN
    const sauvegarderLesEntitésJuridiques = new MetsÀJourLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader
    )

    const numéroFinessEntitéJuridiqueToujoursOuverte = '010018407'
    const entitésJuridiquesOuvertes = [
      {
        ...uneEntitéJuridique,
        numéroFinessEntitéJuridique: numéroFinessEntitéJuridiqueToujoursOuverte,
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

  it('signale une alerte si la récupération des entités juridiques échoue', async () => {
    // GIVEN
    const messageDerreur = 'téléchargement interrompu'
    const sauvegarderLesEntitésJuridiques = new MetsÀJourLesEntitésJuridiquesUseCase(
      fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosRepository,
      fakeDataCrawlerDependencies.entitéJuridiqueHeliosLoader
    )

    jest.spyOn(fakeDataCrawlerDependencies.entitéJuridiqueSourceExterneLoader, 'récupèreLesEntitésJuridiquesOuvertes').mockImplementation(() => {
      throw new Error(messageDerreur)
    })

    try {
      // WHEN
      await sauvegarderLesEntitésJuridiques.exécute()
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${messageDerreur}`)
    }
  })
})
