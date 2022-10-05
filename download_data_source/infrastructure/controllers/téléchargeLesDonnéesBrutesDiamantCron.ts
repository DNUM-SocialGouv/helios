import { TéléchargeLesDonnéesBrutesDiamantUseCase } from '../../métier/use-cases/TéléchargeLesDonnéesBrutesDiamantUseCase'
import { Dependencies, dependencies } from '../dependencies'

const téléchargeLesDonnéesBrutesDiamantCron = (dependencies: Dependencies) => {
  const téléchargeLesDonnéesBrutesDeFinessUseCase = new TéléchargeLesDonnéesBrutesDiamantUseCase(
    dependencies.dnumDownloadRawData
  )

  téléchargeLesDonnéesBrutesDeFinessUseCase.exécute()
}

téléchargeLesDonnéesBrutesDiamantCron(dependencies)
