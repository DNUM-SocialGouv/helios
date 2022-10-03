import fs from 'fs'
import Client from 'ssh2-sftp-client'

import { getFakeDataCrawlerDependencies, fakeLogger } from '../../../testHelper'
import { FinessSftpDownloadRawData } from './FinessSftpDownloadRawData'

describe('Téléchargement de FINESS via un SFTP', () => {
  const sftpPath = 'fake_path'
  const simpleSftpPath = `${sftpPath}/simple`
  const nomenclatureSftpPath = `${sftpPath}/nomenclature`
  const enrichiSftpPath = `${sftpPath}/enrichi`
  const localPath = 'source-fake'
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()

  afterEach(() => {
    fs.rmSync('data_test/source-fake', { recursive: true })
  })

  it('efface les dossiers contenant les anciens fichiers téléchargés en local pour éviter d’utiliser d’anciennes données', async () => {
    // GIVEN
    simuleLeConnecteurDuSftp()
    simuleLaLectureDeLaClefPrivée()
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    // WHEN
    await sftpDownloadDataSource.exécute()

    // THEN
    expect(fs.existsSync(localPath)).toBe(false)
  })

  it('crée le répertoire "simple"', async () => {
    // GIVEN
    simuleLeConnecteurDuSftp()
    simuleLaLectureDeLaClefPrivée()
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    // WHEN
    await sftpDownloadDataSource.exécute()

    // THEN
    expect(fs.existsSync('data_test/source-fake/simple')).toBe(true)
  })

  it('crée le répertoire "nomenclature"', async () => {
    // GIVEN
    simuleLeConnecteurDuSftp()
    simuleLaLectureDeLaClefPrivée()
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    // WHEN
    await sftpDownloadDataSource.exécute()

    // THEN
    expect(fs.existsSync('data_test/source-fake/nomenclature')).toBe(true)
  })

  it('crée le répertoire "enrichi"', async () => {
    // GIVEN
    simuleLeConnecteurDuSftp()
    simuleLaLectureDeLaClefPrivée()
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    // WHEN
    await sftpDownloadDataSource.exécute()

    // THEN
    expect(fs.existsSync('data_test/source-fake/enrichi')).toBe(true)
  })

  it('se connecte au SFTP', async () => {
    // GIVEN
    simuleLeConnecteurDuSftp()
    simuleLaLectureDeLaClefPrivée()
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    // WHEN
    await sftpDownloadDataSource.exécute()

    // THEN
    expect(Client.prototype.connect).toHaveBeenCalledWith({
      algorithms: { kex: ['algo1', 'algo2'] },
      debug: undefined,
      host: 'localhost',
      port: 22,
      privateKey: 'privateKey',
      username: 'usr_finess_ls',
    })
    expect(fakeLogger.info).toHaveBeenNthCalledWith(1, '[FINESS] La connexion au SFTP est ouverte.')
  })

  it('télécharge les dernières fiches d’identité en date du répertoire "simple"', async () => {
    // GIVEN
    simuleLeConnecteurDuSftp()
    simuleLaLectureDeLaClefPrivée()
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    // WHEN
    await sftpDownloadDataSource.exécute()

    // THEN
    expect(Client.prototype.list).toHaveBeenNthCalledWith(1, simpleSftpPath, '*.xml.gz')
    expect(Client.prototype.fastGet).toHaveBeenNthCalledWith(
      1,
      `${simpleSftpPath}/finess_cs1400101_stock_20211214-0333.xml.gz`,
      `data_test/${localPath}/simple/finess_cs1400101_stock_20211214-0333.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(Client.prototype.fastGet).toHaveBeenNthCalledWith(
      2,
      `${simpleSftpPath}/finess_cs1400102_stock_20211214-0336.xml.gz`,
      `data_test/${localPath}/simple/finess_cs1400102_stock_20211214-0336.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(fakeLogger.info).toHaveBeenNthCalledWith(2, '[FINESS] Les deux fichiers contenant les fiches d’identité du répertoire "simple" téléchargés.')
  })

  it('télécharge les dernières catégories en date du répertoire "nomenclature"', async () => {
    // GIVEN
    simuleLeConnecteurDuSftp()
    simuleLaLectureDeLaClefPrivée()
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    // WHEN
    await sftpDownloadDataSource.exécute()

    // THEN
    expect(Client.prototype.list).toHaveBeenNthCalledWith(2, nomenclatureSftpPath, '*.xml.gz')
    expect(Client.prototype.fastGet).toHaveBeenNthCalledWith(
      3,
      `${nomenclatureSftpPath}/finess_cs1500106_stock_20211214-0417.xml.gz`,
      `data_test/${localPath}/nomenclature/finess_cs1500106_stock_20211214-0417.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(fakeLogger.info).toHaveBeenNthCalledWith(3, '[FINESS] Le fichier contenant les catégories du répertoire "nomenclature" téléchargé.')
  })

  it('télécharge les dernières autorisations en date du répertoire "enrichi"', async () => {
    // GIVEN
    simuleLeConnecteurDuSftp()
    simuleLaLectureDeLaClefPrivée()
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    // WHEN
    await sftpDownloadDataSource.exécute()

    // THEN
    expect(Client.prototype.list).toHaveBeenNthCalledWith(3, enrichiSftpPath, '*.xml.gz')
    expect(Client.prototype.fastGet).toHaveBeenNthCalledWith(
      4,
      `${enrichiSftpPath}/finess_cs1400103_stock_20211214-0343.xml.gz`,
      `data_test/${localPath}/enrichi/finess_cs1400103_stock_20211214-0343.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(Client.prototype.fastGet).toHaveBeenNthCalledWith(
      5,
      `${enrichiSftpPath}/finess_cs1400104_stock_20211214-0344.xml.gz`,
      `data_test/${localPath}/enrichi/finess_cs1400104_stock_20211214-0344.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(Client.prototype.fastGet).toHaveBeenNthCalledWith(
      6,
      `${enrichiSftpPath}/finess_cs1400105_stock_20211214-0345.xml.gz`,
      `data_test/${localPath}/enrichi/finess_cs1400105_stock_20211214-0345.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(Client.prototype.fastGet).toHaveBeenNthCalledWith(
      7,
      `${enrichiSftpPath}/finess_cs1600101_stock_20211214-0346.xml.gz`,
      `data_test/${localPath}/enrichi/finess_cs1600101_stock_20211214-0346.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(Client.prototype.fastGet).toHaveBeenNthCalledWith(
      8,
      `${enrichiSftpPath}/finess_cs1600102_stock_20211214-0347.xml.gz`,
      `data_test/${localPath}/enrichi/finess_cs1600102_stock_20211214-0347.xml.gz`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(fakeLogger.info).toHaveBeenNthCalledWith(4, '[FINESS] Les 5 fichiers contenant les autorisations du répertoire "enrichi" téléchargés.')
  })

  it('se déconnecte du SFTP', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée()
    simuleLeConnecteurDuSftp()
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    // WHEN
    await sftpDownloadDataSource.exécute()

    // THEN
    expect(fakeLogger.info).toHaveBeenNthCalledWith(5, '[FINESS] Le connexion au SFTP est fermée.')
    expect(Client.prototype.end).toHaveBeenCalledWith()
  })

  it('signale un message d’erreur quand il se connecte au SFTP avec une mauvaise configuration', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée()
    simuleLeConnecteurDuSftp()
    const errorMessage = 'connexion impossible'
    jest.spyOn(Client.prototype, 'connect').mockImplementation(async (): Promise<any> => await Promise.reject(new Error(errorMessage)))
    const sftpDownloadDataSource = new FinessSftpDownloadRawData(sftpPath, localPath, fakeDataCrawlerDependencies.environmentVariables, fakeLogger)

    try {
      // WHEN
      await sftpDownloadDataSource.exécute()
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] [FINESS] Une erreur est survenue lors de la connexion au SFTP : ${errorMessage}`)
    }
  })
})

function simuleLaLectureDeLaClefPrivée() {
  jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('privateKey')
}

function simuleLeConnecteurDuSftp() {
  jest.spyOn(Client.prototype, 'connect').mockImplementation((): any => jest.fn())
  jest.spyOn(Client.prototype, 'list')
    .mockImplementationOnce((): any => {
      return [
        { name: 'finess_cs1400101_stock_20211214-0333.xml.gz' },
        { name: 'finess_cs1400101_stock_20000101-0000.xml.gz' },
        { name: 'finess_cs1400102_stock_20000101-0000.xml.gz' },
        { name: 'finess_cs1400102_stock_20211214-0336.xml.gz' },
      ]
    })
    .mockImplementationOnce((): any => {
      return [
        { name: 'finess_cs1500106_stock_20211214-0417.xml.gz' },
        { name: 'finess_cs1500106_stock_20000101-0000.xml.gz' },
        { name: 'finess_cs1500107_stock_20221214-0336.xml.gz' },
      ]
    })
    .mockImplementationOnce((): any => {
      return [
        { name: 'finess_cs1400103_stock_20211214-0343.xml.gz' },
        { name: 'finess_cs1400103_stock_20000101-0000.xml.gz' },
        { name: 'finess_cs1400104_stock_20211214-0344.xml.gz' },
        { name: 'finess_cs1400104_stock_20000101-0000.xml.gz' },
        { name: 'finess_cs1400105_stock_20211214-0345.xml.gz' },
        { name: 'finess_cs1400105_stock_20000101-0000.xml.gz' },
        { name: 'finess_cs1600101_stock_20211214-0346.xml.gz' },
        { name: 'finess_cs1600101_stock_20000101-0000.xml.gz' },
        { name: 'finess_cs1600102_stock_20211214-0347.xml.gz' },
        { name: 'finess_cs1600102_stock_20000101-0000.xml.gz' },
      ]
    })
  jest.spyOn(Client.prototype, 'fastGet').mockImplementation((): any => jest.fn())
  jest.spyOn(Client.prototype, 'end').mockImplementation((): any => jest.fn())
}
