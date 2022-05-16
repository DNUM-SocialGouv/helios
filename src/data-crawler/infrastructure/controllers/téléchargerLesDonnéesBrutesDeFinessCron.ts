import { TéléchargerLesDonnéesBrutesDeFinessUseCase } from '../../métier/use-cases/TéléchargerLesDonnéesBrutesDeFinessUseCase'
import { Dependencies, dependencies } from '../dependencies'

const téléchargerLesDonnéesBrutesDeFinessCron = async (initDependencies: Promise<Dependencies>) => {
  const dependencies = await initDependencies
  const retrieveDataSourceFromFinessToLocal = new TéléchargerLesDonnéesBrutesDeFinessUseCase(
    dependencies.downloadRawData,
    dependencies.unzipRawData
  )

  retrieveDataSourceFromFinessToLocal.handle()
}

téléchargerLesDonnéesBrutesDeFinessCron(dependencies)
