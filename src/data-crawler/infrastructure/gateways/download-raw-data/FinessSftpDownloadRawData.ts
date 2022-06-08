import { mkdirSync, readFileSync, rmSync } from 'fs'
import { ConnectConfig } from 'ssh2'
import Client from 'ssh2-sftp-client'

import { DownloadRawData } from '../../../métier/gateways/DownloadRawData'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Logger } from '../../../métier/gateways/Logger'
import { HeliosError } from '../../HeliosError'

export class FinessSftpDownloadRawData implements DownloadRawData {
  constructor(private readonly environmentVariables: EnvironmentVariables, private readonly logger: Logger) {}

  async handle(rawData: string, sftpPath: string, localPath: string) {
    const simpleSftpPath = `${sftpPath}/simple`
    const nomenclatureSftpPath = `${sftpPath}/nomenclature`

    rmSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`, { force: true, recursive: true })

    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/simple`, { recursive: true })
    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/nomenclature`, { recursive: true })

    const configuration: ConnectConfig = {
      debug: this.environmentVariables.SFTP_IS_DEBUG === 'false' ? undefined : this.logger.debug,
      host: this.environmentVariables.SFTP_HOST,
      port: Number(this.environmentVariables.SFTP_PORT),
      privateKey: readFileSync(this.environmentVariables.SFTP_PRIVATE_KEY),
      username: this.environmentVariables.SFTP_USERNAME,
    }
    const sftp = new Client()

    try {
      await sftp.connect(configuration)
      this.logger.info(`[Helios][${rawData}] La connexion au SFTP est ouverte.`)

      const fichesIdentitésFiles = await sftp.list(simpleSftpPath, '*.xml.gz')
      for (let index = 0; index < fichesIdentitésFiles.length; index++) {
        await sftp.fastGet(simpleSftpPath + '/' + fichesIdentitésFiles[index].name, `${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/simple/${fichesIdentitésFiles[index].name}`)
      }
      this.logger.info(`[Helios][${rawData}] Les deux fichiers contenant les fiches d’identité du répertoire "simple" téléchargés.`)

      await sftp.fastGet(nomenclatureSftpPath + '/finess_cs1500106_stock_20211214-0417.xml.gz', `${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}/nomenclature/finess_cs1500106_stock_20211214-0417.xml.gz`)
      this.logger.info(`[Helios][${rawData}] Le fichier contenant les catégories du répertoire "nomenclature" téléchargé.`)

      this.logger.info(`[Helios][${rawData}] Le connexion au SFTP est fermée.`)
      return await sftp.end()
    } catch (error) {
      throw new HeliosError(`[${rawData}] Une erreur est survenue lors de la connexion au SFTP : ${error.message}`)
    }
  }
}
