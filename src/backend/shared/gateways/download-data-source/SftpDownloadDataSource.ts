import { mkdirSync, readFileSync, rmSync } from 'fs'
import { ConnectConfig } from 'ssh2'
import Client from 'ssh2-sftp-client'

import { DownloadDataSource } from '../../entities/DownloadDataSource'
import { EnvironmentVariables } from '../../entities/EnvironmentVariables'
import { ErreurHelios } from '../../entities/ErreurHelios'
import { Logger } from '../../entities/Logger'

export class SftpDownloadDataSource implements DownloadDataSource {
  constructor(private readonly environmentVariables: EnvironmentVariables, private readonly logger: Logger) {}

  handle(dataSource: string, sftpPath: string, localPath: string) {
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

    return sftp.connect(configuration)
      .then(() => {
        this.logger.info(`[Helios][${dataSource}] La connexion au SFTP est ouverte.`)
        return sftp.list('/')
      })
      .then(() => {
        return sftp.downloadDir(sftpPath, `${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`)
      })
      .then(() => {
        this.logger.info(`[Helios][${dataSource}] Sources de données téléchargées.`)
        this.logger.info(`[Helios][${dataSource}] Le connexion au SFTP est fermée.`)
        return sftp.end()
      })
      .catch((error) => {
        throw new ErreurHelios(`[${dataSource}] Une erreur est survenue lors de la connexion au SFTP : ${error.message}`)
      })
  }
}
