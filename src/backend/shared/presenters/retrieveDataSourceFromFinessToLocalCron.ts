import { Dependencies, dependencies } from '../../configuration/dependencies'
import { RetrieveDataSourceFromFinessToLocal } from '../use-cases/RetrieveDataSourceFromFinessToLocal'

const retrieveDataSourceFromFinessToLocalCron = (dependencies: Dependencies) => {
  const retrieveDataSourceFromFinessToLocal = new RetrieveDataSourceFromFinessToLocal(
    dependencies.downloadDataSource,
    dependencies.unzipDataSource
  )

  retrieveDataSourceFromFinessToLocal.handle()
}

retrieveDataSourceFromFinessToLocalCron(dependencies)
