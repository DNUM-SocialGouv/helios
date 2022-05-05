import { EnvironmentVariables } from './EnvironmentVariables'

export type DownloadDataSourceToLocal = (
  dataSource: string,
  sftpPath: string,
  localPath: string,
  environmentVariables: EnvironmentVariables
) => void
