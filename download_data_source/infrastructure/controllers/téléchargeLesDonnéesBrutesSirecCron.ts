import { TéléchargeLesDonnéesBrutesSirecUseCase } from "../../métier/use-cases/TéléchargeLesDonnéesBrutesSirecUseCase";
import { Dependencies, dependencies } from "../dependencies";

const téléchargeLesDonnéesBrutesSirecCron = (dependencies: Dependencies) => {
  const téléchargeLesDonnéesBrutesSirecUseCase = new TéléchargeLesDonnéesBrutesSirecUseCase(dependencies.sirecDownloadRawData);

  téléchargeLesDonnéesBrutesSirecUseCase.exécute();
};

téléchargeLesDonnéesBrutesSirecCron(dependencies);
