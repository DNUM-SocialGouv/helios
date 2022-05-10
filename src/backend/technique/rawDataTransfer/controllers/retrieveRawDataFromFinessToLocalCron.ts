import { Dependencies, dependencies } from '../../configuration/dependencies'
import { RetrieveRawDataFromFinessToLocalUseCase } from '../use-cases/RetrieveRawDataFromFinessToLocalUseCase'

const retrieveRawDataFromFinessToLocalCron = (dependencies: Dependencies) => {
  const retrieveDataSourceFromFinessToLocal = new RetrieveRawDataFromFinessToLocalUseCase(
    dependencies.downloadRawData,
    dependencies.unzipRawData
  )

  retrieveDataSourceFromFinessToLocal.handle()
}

retrieveRawDataFromFinessToLocalCron(dependencies)
