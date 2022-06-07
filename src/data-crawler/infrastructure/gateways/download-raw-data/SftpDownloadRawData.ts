import { mkdirSync, readFileSync, rmSync } from 'fs'
import { ConnectConfig } from 'ssh2'
import Client from 'ssh2-sftp-client'

import { DownloadRawData } from '../../../métier/gateways/DownloadRawData'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Logger } from '../../../métier/gateways/Logger'
import { HeliosError } from '../../HeliosError'

export class SftpDownloadRawData implements DownloadRawData {
  constructor(private readonly environmentVariables: EnvironmentVariables, private readonly logger: Logger) {}

  async handle(rawData: string, sftpPath: string, localPath: string) {
    mkdirSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`, { recursive: true })

    rmSync(`${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`, { recursive: true })

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
      await sftp.list('/')
      await sftp.downloadDir(sftpPath, `${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`)
      this.logger.info(`[Helios][${rawData}] Sources de données téléchargées.`)
      this.logger.info(`[Helios][${rawData}] Le connexion au SFTP est fermée.`)
      return await sftp.end()
    } catch (error) {
      throw new HeliosError(`[${rawData}] Une erreur est survenue lors de la connexion au SFTP : ${error.message}`)
    }
  }
}
