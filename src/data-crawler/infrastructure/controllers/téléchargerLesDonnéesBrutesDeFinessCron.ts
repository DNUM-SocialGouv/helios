import { TéléchargerLesDonnéesBrutesDeFinessUseCase } from '../../métier/use-cases/TéléchargerLesDonnéesBrutesDeFinessUseCase'
import { Dependencies, dependencies } from '../dependencies'

const téléchargerLesDonnéesBrutesDeFinessCron = (dependencies: Dependencies) => {
  const retrieveDataSourceFromFinessToLocal = new TéléchargerLesDonnéesBrutesDeFinessUseCase(
    dependencies.downloadRawData,
    dependencies.unzipRawData
  )

  retrieveDataSourceFromFinessToLocal.handle()
}

téléchargerLesDonnéesBrutesDeFinessCron(dependencies)
