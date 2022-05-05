import { mkdirSync, readFileSync, rmSync } from 'fs'
import { ConnectConfig } from 'ssh2'
import Client from 'ssh2-sftp-client'

import { DownloadDataSourceToLocal } from '../../entities/DownloadDataSourceToLocal'
import { EnvironmentVariables } from '../../entities/EnvironmentVariables'

export const downloadDataSourceToLocal: DownloadDataSourceToLocal = (
  dataSource: string,
  sftpPath: string,
  localPath: string,
  environmentVariables: EnvironmentVariables
) => {
  mkdirSync(localPath, { recursive: true })

  rmSync(localPath, { force: true, recursive: true })

  const configuration: ConnectConfig = {
    debug: environmentVariables.SFTP_IS_DEBUG === 'false' ? undefined : console.debug,
    host: environmentVariables.SFTP_HOST,
    port: Number(environmentVariables.SFTP_PORT),
    privateKey: readFileSync(environmentVariables.SFTP_PRIVATE_KEY),
    username: environmentVariables.SFTP_USERNAME,
  }
  const sftp = new Client()

  return sftp.connect(configuration)
    .then(() => {
      console.info(`[Helios][${dataSource}] La connexion au SFTP est ouverte.`)
      return sftp.list('/')
    })
    .then(() => {
      return sftp.downloadDir(sftpPath, localPath)
    })
    .then(() => {
      console.info(`[Helios][${dataSource}] Sources de données téléchargées.`)
      console.info(`[Helios][${dataSource}] Le connexion au SFTP est fermée.`)
      return sftp.end()
    })
    .catch((error) => {
      throw new Error(`[Helios][${dataSource}] Une erreur est survenue lors de la connexion au SFTP : ${error.message}`)
    })
}
