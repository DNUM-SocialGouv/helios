import { fakeDataCrawlerDependencies } from '../../testHelper'
import { TéléchargerLesDonnéesBrutesDeFinessUseCase } from './TéléchargerLesDonnéesBrutesDeFinessUseCase'

describe('Récupération des sources de données FINESS en local', () => {
  it('récupérer les sources de données FINESS en local', async () => {
    // GIVEN
    const sourceDeDonnées = 'FINESS'
    const cheminSftp = 'flux_finess'
    const téléchargerLesDonnéesBrutesDeFiness = new TéléchargerLesDonnéesBrutesDeFinessUseCase(
      fakeDataCrawlerDependencies.downloadRawData,
      fakeDataCrawlerDependencies.unzipRawData
    )

    // WHEN
    await téléchargerLesDonnéesBrutesDeFiness.handle()

    // THEN
    await expect(fakeDataCrawlerDependencies.downloadRawData.handle).toHaveBeenCalledWith(sourceDeDonnées, cheminSftp, 'finess')
    await expect(fakeDataCrawlerDependencies.unzipRawData.handle).toHaveBeenCalledWith(sourceDeDonnées, 'finess')
  })

  it('une erreur est survenue lors du téléchargement des données', async () => {
    // GIVEN
    const messageDerreur = 'téléchargement interrompu'
    jest.spyOn(fakeDataCrawlerDependencies.downloadRawData, 'handle').mockImplementation(jest.fn(async () => {
      await Promise.reject(new Error(messageDerreur))
    }))
    const téléchargerLesDonnéesBrutesDeFiness = new TéléchargerLesDonnéesBrutesDeFinessUseCase(
      fakeDataCrawlerDependencies.downloadRawData,
      fakeDataCrawlerDependencies.unzipRawData
    )

    try {
      // WHEN
      await téléchargerLesDonnéesBrutesDeFiness.handle()
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${messageDerreur}`)
    }
  })

  it('une erreur est survenue lors du la décompression des fichiers', async () => {
    // GIVEN
    const messageDerreur = 'décompression interrompue'
    jest.spyOn(fakeDataCrawlerDependencies.unzipRawData, 'handle').mockImplementation(jest.fn(async () => {
      await Promise.reject(new Error(messageDerreur))
    }))
    const téléchargerLesDonnéesBrutesDeFiness = new TéléchargerLesDonnéesBrutesDeFinessUseCase(
      fakeDataCrawlerDependencies.downloadRawData,
      fakeDataCrawlerDependencies.unzipRawData
    )

    try {
      // WHEN
      await téléchargerLesDonnéesBrutesDeFiness.handle()
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${messageDerreur}`)
    }
  })
})
