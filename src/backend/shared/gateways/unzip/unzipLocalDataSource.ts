import { execSync } from 'child_process'

import { UnzipLocalDataSource } from '../../entities/UnzipLocalDataSource'

export const unzipLocalDataSource: UnzipLocalDataSource = (dataSource: string, localPath: string) => {
  try {
    execSync(`gunzip -rf ${localPath}`)
    console.info(`[Helios][${dataSource}] Sources de données décompressées.`)
  } catch (error) {
    throw new Error(`[Helios][${dataSource}] Une erreur est survenue lors de la décompression du répertoire ${localPath} : ${error.message}`)
  }
}
