import { DownloadDataSourceToLocal } from '../entities/DownloadDataSourceToLocal'
import { EnvironmentVariables } from '../entities/EnvironmentVariables'
import { UnzipLocalDataSource } from '../entities/UnzipLocalDataSource'

export const retrieveDataSourceFromFinessToLocal = async (
  downloadDataSourceToLocal: DownloadDataSourceToLocal,
  unzipLocalDataSource: UnzipLocalDataSource,
  environmentVariables: EnvironmentVariables
) => {
  const dataSource = 'FINESS'
  const sftpPath = 'flux_finess'
  const localPath = `${environmentVariables.SFTP_LOCAL_PATH}/finess/`

  try {
    await downloadDataSourceToLocal(dataSource, sftpPath, localPath, environmentVariables)
  } catch (error) {
    throw new Error(`[Helios] ${error.message}`)
  }

  try {
    await unzipLocalDataSource(dataSource, localPath)
  } catch (error) {
    throw new Error(`[Helios] ${error.message}`)
  }
}
