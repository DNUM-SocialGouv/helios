import { execSync } from 'child_process'

import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Logger } from '../../../métier/gateways/Logger'
import { UnzipRawData } from '../../../métier/gateways/UnzipRawData'
import { HeliosError } from '../../HeliosError'

export class GunzipUnzipRawData implements UnzipRawData {
  constructor(private readonly environmentVariables: EnvironmentVariables, private readonly logger: Logger) {}

  exécute(dataSourceName: string, localPath: string) {
    try {
      execSync(`gunzip -rf ${this.environmentVariables.SFTP_LOCAL_PATH}/${localPath}`)
      this.logger.info(`[${dataSourceName}] Sources de données décompressées.`)
    } catch (error) {
      throw new HeliosError(`[${dataSourceName}] Une erreur est survenue lors de la décompression du répertoire ${localPath} : ${error.message}`)
    }
  }
}
