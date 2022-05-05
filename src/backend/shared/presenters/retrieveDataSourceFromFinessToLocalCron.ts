import { dependencies } from '../../configuration/dependencies'
import { DownloadDataSourceToLocal } from '../entities/DownloadDataSourceToLocal'
import { UnzipLocalDataSource } from '../entities/UnzipLocalDataSource'
import { downloadDataSourceToLocal } from '../gateways/download-data-source/downloadDataSourceToLocal'
import { unzipLocalDataSource } from '../gateways/unzip/unzipLocalDataSource'
import { retrieveDataSourceFromFinessToLocal } from '../use_cases/retrieveDataSourceFromFinessToLocal'

const retrieveDataSourceFromFinessToLocalCron = (downloadDataSourceToLocal: DownloadDataSourceToLocal, unzipLocalDataSource: UnzipLocalDataSource) => {
  const { environmentVariables } = dependencies

  retrieveDataSourceFromFinessToLocal(downloadDataSourceToLocal, unzipLocalDataSource, environmentVariables)
}

retrieveDataSourceFromFinessToLocalCron(downloadDataSourceToLocal, unzipLocalDataSource)
