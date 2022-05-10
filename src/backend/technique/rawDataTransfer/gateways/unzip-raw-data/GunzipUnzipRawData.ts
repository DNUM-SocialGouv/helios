import { execSync } from 'child_process'

import { EnvironmentVariables } from '../../../shared/entities/EnvironmentVariables'
import { HeliosError } from '../../../shared/entities/HeliosError'
import { Logger } from '../../../shared/entities/Logger'
import { UnzipRawData } from '../../entities/UnzipRawData'

export class GunzipUnzipRawData implements UnzipRawData {
  constructor(private readonly environmentVariables: EnvironmentVariables, private readonly logger: Logger) {}

  handle(rawData: string, localPath: string) {
    try {
      execSync(`gunzip -rf ${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`)
      this.logger.info(`[Helios][${rawData}] Sources de données décompressées.`)
    } catch (error) {
      throw new HeliosError(`[${rawData}] Une erreur est survenue lors de la décompression du répertoire ${localPath} : ${error.message}`)
    }
  }
}
