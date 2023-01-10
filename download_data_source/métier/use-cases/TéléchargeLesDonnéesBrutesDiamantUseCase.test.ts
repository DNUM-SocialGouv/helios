import { getFakeDataCrawlerDependencies } from '../../testHelper'
import { TéléchargeLesDonnéesBrutesDiamantUseCase } from './TéléchargeLesDonnéesBrutesDiamantUseCase'

describe('Récupération des fichiers sources de DIAMANT en local', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()

  it('récupère les fichiers sources de DIAMANT en local', async () => {
    // GIVEN
    const téléchargeLesDonnéesBrutesDiamantUseCase = new TéléchargeLesDonnéesBrutesDiamantUseCase(fakeDataCrawlerDependencies.dnumDownloadRawData)

    // WHEN
    await téléchargeLesDonnéesBrutesDiamantUseCase.exécute()

    // THEN
    expect(fakeDataCrawlerDependencies.dnumDownloadRawData.exécute).toHaveBeenCalledWith()
  })

  it('signale quand une erreur est survenue lors du téléchargement des données', async () => {
    // GIVEN
    const messageDerreur = 'téléchargement interrompu'
    jest.spyOn(fakeDataCrawlerDependencies.dnumDownloadRawData, 'exécute').mockImplementation().mockRejectedValueOnce(new Error(messageDerreur))
    const téléchargeLesDonnéesBrutesDiamantUseCase = new TéléchargeLesDonnéesBrutesDiamantUseCase(fakeDataCrawlerDependencies.dnumDownloadRawData)

    try {
      // WHEN
      await téléchargeLesDonnéesBrutesDiamantUseCase.exécute()
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${messageDerreur}`)
    }
  })
})
