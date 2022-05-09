import { execSync } from 'child_process'

import { EnvironmentVariables } from '../../entities/EnvironmentVariables'
import { ErreurHelios } from '../../entities/ErreurHelios'
import { Logger } from '../../entities/Logger'
import { UnzipDataSource } from '../../entities/UnzipDataSource'

export class GunzipUnzipDataSource implements UnzipDataSource {
  constructor(private readonly environmentVariables: EnvironmentVariables, private readonly logger: Logger) {}

  handle(dataSource: string, localPath: string) {
    try {
      execSync(`gunzip -rf ${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`)
      this.logger.info(`[Helios][${dataSource}] Sources de données décompressées.`)
    } catch (error) {
      throw new ErreurHelios(`[${dataSource}] Une erreur est survenue lors de la décompression du répertoire ${localPath} : ${error.message}`)
    }
  }
}
