import { fakeDependencies } from '../../../../tests/testHelper'
import { RetrieveDataSourceFromFinessToLocal } from './RetrieveDataSourceFromFinessToLocal'

describe('Récupération des sources de données FINESS en local', () => {
  it('récupérer les sources de données FINESS en local', async () => {
    // GIVEN
    const dataSource = 'FINESS'
    const sftpPath = 'flux_finess'
    const retrieveDataSourceFromFinessToLocal = new RetrieveDataSourceFromFinessToLocal(
      fakeDependencies.downloadDataSource,
      fakeDependencies.unzipDataSource
    )

    // WHEN
    await retrieveDataSourceFromFinessToLocal.handle()

    // THEN
    await expect(fakeDependencies.downloadDataSource.handle).toHaveBeenCalledWith(dataSource, sftpPath, 'finess')
    await expect(fakeDependencies.unzipDataSource.handle).toHaveBeenCalledWith(dataSource, 'finess')
  })

  it('une erreur est survenue lors du téléchargement des données', async () => {
    // GIVEN
    const errorMessage = 'téléchargement interrompu'
    jest.spyOn(fakeDependencies.downloadDataSource, 'handle').mockImplementation(jest.fn(async () => {
      await Promise.reject(new Error(errorMessage))
    }))
    const retrieveDataSourceFromFinessToLocal = new RetrieveDataSourceFromFinessToLocal(
      fakeDependencies.downloadDataSource,
      fakeDependencies.unzipDataSource
    )

    try {
      // WHEN
      await retrieveDataSourceFromFinessToLocal.handle()
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${errorMessage}`)
    }
  })

  it('une erreur est survenue lors du la décompression des fichiers', async () => {
    // GIVEN
    const errorMessage = 'décompression interrompue'
    jest.spyOn(fakeDependencies.unzipDataSource, 'handle').mockImplementation(jest.fn(async () => {
      await Promise.reject(new Error(errorMessage))
    }))
    const retrieveDataSourceFromFinessToLocal = new RetrieveDataSourceFromFinessToLocal(
      fakeDependencies.downloadDataSource,
      fakeDependencies.unzipDataSource
    )

    try {
      // WHEN
      await retrieveDataSourceFromFinessToLocal.handle()
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${errorMessage}`)
    }
  })
})
