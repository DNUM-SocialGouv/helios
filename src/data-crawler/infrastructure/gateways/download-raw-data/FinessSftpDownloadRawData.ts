import { mkdirSync, readFileSync, rmSync } from 'fs'
import { ConnectConfig } from 'ssh2'
import Client, { FileInfo } from 'ssh2-sftp-client'

import { DownloadRawData } from '../../../métier/gateways/DownloadRawData'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Logger } from '../../../métier/gateways/Logger'
import { HeliosError } from '../../HeliosError'

export class FinessSftpDownloadRawData implements DownloadRawData {
  sftp: Client
  simpleSftpPath: string
  nomenclatureSftpPath: string

  constructor(private readonly environmentVariables: EnvironmentVariables, private readonly logger: Logger) {
    this.simpleSftpPath = ''
    this.nomenclatureSftpPath = ''
    this.sftp = new Client()
  }

  async exécute(rawData: string, sftpPath: string, localPath: string) {
    this.simpleSftpPath = `${sftpPath}/simple`
    this.nomenclatureSftpPath = `${sftpPath}/nomenclature`

    this.removeDirectories(localPath)
    this.makeDirectories(localPath)

    throw new Error('Test pour sentry.')

    try {
      await this.connect(rawData)
      await this.downloadFichesIdentité(rawData, localPath)
      await this.downloadCatégories(rawData, localPath)
      await this.disconnect(rawData)
    } catch (error) {
      throw new HeliosError(`[${rawData}] Une erreur est survenue lors de la connexion au SFTP : ${error.message}`)
    }
  }

  private removeDirectories(localPath: string) {
    rmSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`, { force: true, recursive: true })
  }

  private makeDirectories(localPath: string) {
    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/simple`, { recursive: true })
    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/nomenclature`, { recursive: true })
  }

  private async connect(rawData: string) {
    const configuration: ConnectConfig = {
      algorithms: { kex: JSON.parse(this.environmentVariables.SFTP_KEX_ALGORITHMS) },
      debug: this.environmentVariables.SFTP_IS_DEBUG === 'false' ? undefined : this.logger.debug,
      host: this.environmentVariables.SFTP_HOST,
      port: Number(this.environmentVariables.SFTP_PORT),
      privateKey: readFileSync(this.environmentVariables.SFTP_PRIVATE_KEY),
      username: this.environmentVariables.SFTP_USERNAME,
    }

    await this.sftp.connect(configuration)
    this.logger.info(`[Helios][${rawData}] La connexion au SFTP est ouverte.`)
  }

  private async downloadFichesIdentité(rawData: string, localPath: string) {
    const fichesIdentitéFiles = await this.sftp.list(this.simpleSftpPath, '*.xml.gz')
    const entitéJuridiqueFileName = 'finess_cs1400101_stock_'
    const établissementTerritorialFileName = 'finess_cs1400102_stock_'

    await this.downloadFile(fichesIdentitéFiles, `${localPath}/simple`, this.simpleSftpPath, entitéJuridiqueFileName)

    await this.downloadFile(fichesIdentitéFiles, `${localPath}/simple`, this.simpleSftpPath, établissementTerritorialFileName)

    this.logger.info(`[Helios][${rawData}] Les deux fichiers contenant les fiches d’identité du répertoire "simple" téléchargés.`)
  }

  private async downloadCatégories(rawData: string, localPath: string) {
    const nomenclatureFiles = await this.sftp.list(this.nomenclatureSftpPath, '*.xml.gz')
    const catégoriesFileName = 'finess_cs1500106_stock_'

    await this.downloadFile(nomenclatureFiles, `${localPath}/nomenclature`, this.nomenclatureSftpPath, catégoriesFileName)

    this.logger.info(`[Helios][${rawData}] Le fichier contenant les catégories du répertoire "nomenclature" téléchargé.`)
  }

  private async disconnect(rawData: string) {
    this.logger.info(`[Helios][${rawData}] Le connexion au SFTP est fermée.`)

    return await this.sftp.end()
  }

  private async downloadFile(files: FileInfo[], localPath: string, remotePath: string, fileName: string) {
    const orderedFiles = files
      .filter((file: FileInfo) => file.name.includes(fileName))
      .sort(this.sortByLastDate)

    await this.sftp.fastGet(
      `${remotePath}/${orderedFiles[0].name}`,
      `${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/${orderedFiles[0].name}`,
      {
        chunkSize: 1000000,
        concurrency: 2,
      }
    )
  }

  private sortByLastDate(a: FileInfo, b: FileInfo) {
    const valueA = a.name
    const valueB = b.name

    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0
  }
}
