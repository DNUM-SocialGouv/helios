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

  async handle(rawData: string, sftpPath: string, localPath: string) {
    this.simpleSftpPath = `${sftpPath}/simple`
    this.nomenclatureSftpPath = `${sftpPath}/nomenclature`

    this.makeDirectories(localPath)

    try {
      await this.connect(rawData)
      await this.downloadFichesIdentité(rawData, localPath)
      await this.downloadCatégories(rawData, localPath)
      await this.disconnect(rawData)
    } catch (error) {
      throw new HeliosError(`[${rawData}] Une erreur est survenue lors de la connexion au SFTP : ${error.message}`)
    }
  }

  private makeDirectories(localPath: string) {
    rmSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`, { force: true, recursive: true })

    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/simple`, { recursive: true })
    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/nomenclature`, { recursive: true })
  }

  private async connect(rawData: string) {
    const configuration: ConnectConfig = {
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
    const fichesIdentitéEjOrdered = fichesIdentitéFiles
      .filter((ficheIdentité) => ficheIdentité.name.includes('finess_cs1400101_stock_'))
      .sort(this.sortByLastDate)
    const fichesIdentitéEtOrdered = fichesIdentitéFiles
      .filter((ficheIdentité) => ficheIdentité.name.includes('finess_cs1400102_stock_'))
      .sort(this.sortByLastDate)
    await this.sftp.fastGet(`${this.simpleSftpPath}/${fichesIdentitéEjOrdered[0].name}`, `${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/simple/${fichesIdentitéEjOrdered[0].name}`)
    await this.sftp.fastGet(`${this.simpleSftpPath}/${fichesIdentitéEtOrdered[0].name}`, `${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/simple/${fichesIdentitéEtOrdered[0].name}`)
    this.logger.info(`[Helios][${rawData}] Les deux fichiers contenant les fiches d’identité du répertoire "simple" téléchargés.`)
  }

  private async downloadCatégories(rawData: string, localPath: string) {
    const nomenclatureFiles = await this.sftp.list(this.nomenclatureSftpPath, '*.xml.gz')
    const catégories = nomenclatureFiles
      .filter((nomenclature) => nomenclature.name.includes('finess_cs1500106_stock_'))
      .sort(this.sortByLastDate)
    await this.sftp.fastGet(`${this.nomenclatureSftpPath}/${catégories[0].name}`, `${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/nomenclature/${catégories[0].name}`)
    this.logger.info(`[Helios][${rawData}] Le fichier contenant les catégories du répertoire "nomenclature" téléchargé.`)
  }

  private async disconnect(rawData: string) {
    this.logger.info(`[Helios][${rawData}] Le connexion au SFTP est fermée.`)
    return await this.sftp.end()
  }

  private sortByLastDate(a: FileInfo, b: FileInfo) {
    const valueA = a.name
    const valueB = b.name

    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0
  }
}
