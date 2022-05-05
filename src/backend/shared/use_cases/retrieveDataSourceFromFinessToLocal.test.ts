import { environmentVariables } from '../../../../tests/testHelper'
import { retrieveDataSourceFromFinessToLocal } from './retrieveDataSourceFromFinessToLocal'

describe('Récupération des sources de données FINESS en local', () => {
  it('récupérer les sources de données FINESS en local', async () => {
    // GIVEN
    const dataSource = 'FINESS'
    const sftpPath = 'flux_finess'
    const downloadDataSourceToLocal = jest.fn()
    const unzipLocalDataSource = jest.fn()
    const localPath = environmentVariables.SFTP_LOCAL_PATH

    // WHEN
    await retrieveDataSourceFromFinessToLocal(downloadDataSourceToLocal, unzipLocalDataSource, environmentVariables)

    // THEN
    await expect(downloadDataSourceToLocal).toHaveBeenCalledWith(dataSource, sftpPath, `${localPath}/finess/`, environmentVariables)
    await expect(unzipLocalDataSource).toHaveBeenCalledWith(dataSource, `${localPath}/finess/`)
  })

  it('une erreur est survenue lors du téléchargement des données', async () => {
    // GIVEN
    const errorMessage = 'téléchargement interrompu'
    const downloadDataSourceToLocal = jest.fn(async () => {
      await Promise.reject(new Error(errorMessage))
    })
    const unzipLocalDataSource = jest.fn()

    try {
      // WHEN
      await retrieveDataSourceFromFinessToLocal(downloadDataSourceToLocal, unzipLocalDataSource, environmentVariables)
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${errorMessage}`)
    }
  })

  it('une erreur est survenue lors du la décompression des fichiers', async () => {
    // GIVEN
    const errorMessage = 'décompression interrompue'
    const downloadDataSourceToLocal = jest.fn()
    const unzipLocalDataSource = jest.fn(async () => {
      await Promise.reject(new Error(errorMessage))
    })

    try {
      // WHEN
      await retrieveDataSourceFromFinessToLocal(downloadDataSourceToLocal, unzipLocalDataSource, environmentVariables)
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] ${errorMessage}`)
    }
  })
})
