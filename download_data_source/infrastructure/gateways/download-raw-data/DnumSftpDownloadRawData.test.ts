import fs from 'fs'
import path from 'path'
import { FileInfo } from 'ssh2-sftp-client'

import { fakeLogger, getFakeDataCrawlerDependencies } from '../../../testHelper'
import { ClientSftp } from './ClientSftp'
import { DnumSftpDownloadRawData } from './DnumSftpDownloadRawData'

describe('Téléchargement des données DIAMANT via SFTP', () => {
  const fakeRépertoireDeDestination = 'fake-diamant-destination'
  const fakeCléPrivé = 'privateDnumKey'
  const fakeDependencies = getFakeDataCrawlerDependencies()
  const fakeClientSftp: ClientSftp = {
    connect: jest.fn(),
    end: jest.fn(),
    fastGet: jest.fn(),
    list: jest.fn(),
  }
  const fakeCheminDesFichiersSourcesSurLeSftp = 'chemin/des/fichiers/sources'

  afterEach(() => {
    fs.rmSync(fakeRépertoireDeDestination, { recursive: true })
  })

  it('crée le répertoire de destination des fichiers téléchargés', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée(fakeCléPrivé)
    simuleLaListeDesFichiersPrésentsSurLeSftp(fakeClientSftp, [])
    const dnumSftpDownloadRawData = new DnumSftpDownloadRawData(
      fakeClientSftp,
      fakeDependencies.environmentVariables,
      fakeCheminDesFichiersSourcesSurLeSftp,
      fakeRépertoireDeDestination,
      fakeLogger
    )
    // WHEN
    await dnumSftpDownloadRawData.exécute()

    // THEN
    expect(fs.existsSync(fakeRépertoireDeDestination)).toBeTruthy()
  })

  it('se connecte au SFTP grâce à la clé privée', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée(fakeCléPrivé)
    simuleLaListeDesFichiersPrésentsSurLeSftp(fakeClientSftp, [])
    const dnumSftpDownloadRawData = new DnumSftpDownloadRawData(
      fakeClientSftp,
      fakeDependencies.environmentVariables,
      fakeCheminDesFichiersSourcesSurLeSftp,
      fakeRépertoireDeDestination,
      fakeLogger
    )

    // WHEN
    await dnumSftpDownloadRawData.exécute()

    // THEN
    expect(fakeClientSftp.connect).toHaveBeenCalledWith({
      debug: undefined,
      host: fakeDependencies.environmentVariables.DNUM_SFTP_HOST,
      port: Number(fakeDependencies.environmentVariables.DNUM_SFTP_PORT),
      privateKey: fakeCléPrivé,
      username: fakeDependencies.environmentVariables.DNUM_SFTP_USERNAME,
    })
    expect(fakeLogger.info).toHaveBeenNthCalledWith(1, '[DNUM] La connexion au SFTP est ouverte.')
  })

  it('télécharge la dernière version des fichiers', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée(fakeCléPrivé)
    simuleLaListeDesFichiersPrésentsSurLeSftp(fakeClientSftp, [
      { name: 'ANN_ERRD_EJ_ET_2022_08_03.CSV.gpg' },
      { name: 'ANN_ERRD_EJ_ET_2022_09_01.CSV.gpg' },
    ])
    const fichierÀTélécharger = ['ANN_ERRD_EJ_ET']
    const dnumSftpDownloadRawData = new DnumSftpDownloadRawData(
      fakeClientSftp,
      fakeDependencies.environmentVariables,
      fakeCheminDesFichiersSourcesSurLeSftp,
      fakeRépertoireDeDestination,
      fakeLogger,
      fichierÀTélécharger
    )

    // WHEN
    await dnumSftpDownloadRawData.exécute()

    // THEN
    expect(fakeClientSftp.list).toHaveBeenNthCalledWith(1, fakeCheminDesFichiersSourcesSurLeSftp, '*.gpg')
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      1,
      path.join(fakeCheminDesFichiersSourcesSurLeSftp, 'ANN_ERRD_EJ_ET_2022_09_01.CSV.gpg'),
      path.join(fakeRépertoireDeDestination, 'ANN_ERRD_EJ_ET_2022_09_01.CSV.gpg'),
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(fakeLogger.info).toHaveBeenNthCalledWith(2, '[DNUM] Le fichier DIAMANT ANN_ERRD_EJ_ET_2022_09_01.CSV.gpg a été téléchargé.')
  })

  it('distingue les fichiers ayant des préfixes en commun mais des noms complets différents', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée(fakeCléPrivé)
    simuleLaListeDesFichiersPrésentsSurLeSftp(fakeClientSftp, [
      { name: 'ANN_ERRD_EJ_2022_08_03.CSV.gpg' },
      { name: 'ANN_ERRD_EJ_2022_09_01.CSV.gpg' },
      { name: 'ANN_ERRD_EJ_ET_2022_08_03.CSV.gpg' },
      { name: 'ANN_ERRD_EJ_ET_2022_09_01.CSV.gpg' },
    ])
    const fichierÀTélécharger = ['ANN_ERRD_EJ', 'ANN_ERRD_EJ_ET']
    const dnumSftpDownloadRawData = new DnumSftpDownloadRawData(
      fakeClientSftp,
      fakeDependencies.environmentVariables,
      fakeCheminDesFichiersSourcesSurLeSftp,
      fakeRépertoireDeDestination,
      fakeLogger,
      fichierÀTélécharger
    )

    // WHEN
    await dnumSftpDownloadRawData.exécute()

    // THEN
    expect(fakeClientSftp.list).toHaveBeenNthCalledWith(1, fakeCheminDesFichiersSourcesSurLeSftp, '*.gpg')
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      1,
      path.join(fakeCheminDesFichiersSourcesSurLeSftp, 'ANN_ERRD_EJ_2022_09_01.CSV.gpg'),
      path.join(fakeRépertoireDeDestination, 'ANN_ERRD_EJ_2022_09_01.CSV.gpg'),
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
    expect(fakeClientSftp.fastGet).toHaveBeenNthCalledWith(
      2,
      path.join(fakeCheminDesFichiersSourcesSurLeSftp, 'ANN_ERRD_EJ_ET_2022_09_01.CSV.gpg'),
      path.join(fakeRépertoireDeDestination, 'ANN_ERRD_EJ_ET_2022_09_01.CSV.gpg'),
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
  })

  it('signale un message d’erreur si le fichier à télécharger n’est pas présent', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée(fakeCléPrivé)
    simuleLaListeDesFichiersPrésentsSurLeSftp(fakeClientSftp, [
      { name: 'ANN_ERRD_EJ_ET_2022_08_03.CSV.gpg' },
      { name: 'ANN_ERRD_EJ_ET_2022_09_01.CSV.gpg' },
    ])
    const fichierÀTélécharger = ['fichier_non_présent']
    const dnumSftpDownloadRawData = new DnumSftpDownloadRawData(
      fakeClientSftp,
      fakeDependencies.environmentVariables,
      fakeCheminDesFichiersSourcesSurLeSftp,
      fakeRépertoireDeDestination,
      fakeLogger,
      fichierÀTélécharger
    )

    // WHEN
    await dnumSftpDownloadRawData.exécute()

    // THEN
    expect(fakeClientSftp.list).toHaveBeenNthCalledWith(1, fakeCheminDesFichiersSourcesSurLeSftp, '*.gpg')
    expect(fakeLogger.error).toHaveBeenNthCalledWith(1, '[DIAMANT] Le fichier fichier_non_présent n’est pas présent sur le sftp.')
  })

  it('se déconnecte du SFTP', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée(fakeCléPrivé)
    simuleLaListeDesFichiersPrésentsSurLeSftp(fakeClientSftp, [])
    const dnumSftpDownloadRawData = new DnumSftpDownloadRawData(
      fakeClientSftp,
      fakeDependencies.environmentVariables,
      fakeCheminDesFichiersSourcesSurLeSftp,
      fakeRépertoireDeDestination,
      fakeLogger
    )

    // WHEN
    await dnumSftpDownloadRawData.exécute()

    // THEN
    expect(fakeLogger.info).toHaveBeenNthCalledWith(2, '[DNUM] La connexion au SFTP est fermée.')
    expect(fakeClientSftp.end).toHaveBeenCalledWith()
  })

  it('efface le répertoire de destination des fichiers téléchargés pour éviter d’utiliser d’anciennes données', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée(fakeCléPrivé)
    simuleLaListeDesFichiersPrésentsSurLeSftp(fakeClientSftp, [])
    const dnumSftpDownloadRawData = new DnumSftpDownloadRawData(
      fakeClientSftp,
      fakeDependencies.environmentVariables,
      fakeCheminDesFichiersSourcesSurLeSftp,
      fakeRépertoireDeDestination,
      fakeLogger
    )
    fs.mkdirSync(fakeRépertoireDeDestination, { recursive: true })
    const fichierPrésentAvantExécution = path.join(fakeRépertoireDeDestination, 'fake-file.txt')
    fs.writeFileSync(fichierPrésentAvantExécution, 'Ce fichier sera supprimé.')

    // WHEN
    await dnumSftpDownloadRawData.exécute()

    // THEN
    expect(fs.existsSync(fichierPrésentAvantExécution)).toBe(false)
  })

  it('signale un message d’erreur quand il se connecte au SFTP avec une mauvaise configuration', async () => {
    // GIVEN
    simuleLaLectureDeLaClefPrivée(fakeCléPrivé)
    simuleLaListeDesFichiersPrésentsSurLeSftp(fakeClientSftp, [])
    const messageDErreur = 'La connexion n’a pas pu être établie'
    jest.spyOn(fakeClientSftp, 'connect').mockImplementation().mockRejectedValueOnce(new Error(messageDErreur))
    const dnumSftpDownloadRawData = new DnumSftpDownloadRawData(
      fakeClientSftp,
      fakeDependencies.environmentVariables,
      fakeCheminDesFichiersSourcesSurLeSftp,
      fakeRépertoireDeDestination,
      fakeLogger
    )

    try {
      // WHEN
      await dnumSftpDownloadRawData.exécute()
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] [DNUM] Une erreur est survenue lors de la connexion au SFTP : ${messageDErreur}`)
    }
  })
})

function simuleLaListeDesFichiersPrésentsSurLeSftp(clientSftp: ClientSftp, fichiers: {name: string}[]) {
  jest.spyOn(clientSftp, 'list').mockImplementation().mockResolvedValueOnce(fichiers as FileInfo[])
}

function simuleLaLectureDeLaClefPrivée(cléPrivé: string) {
  jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(cléPrivé)
}
