import { TéléchargeLesDonnéesBrutesSiiceaUseCase } from "../../métier/use-cases/TéléchargeLesDonnéesBrutesSiiceaUseCase";
import { Dependencies, dependencies } from "../dependencies";

const téléchargeLesDonnéesBrutesSiiceaCron = (dependencies: Dependencies) => {
  const téléchargeLesDonnéesBrutesSirecUseCase = new TéléchargeLesDonnéesBrutesSiiceaUseCase(dependencies.siiceaDownloadRawData);

  téléchargeLesDonnéesBrutesSirecUseCase.exécute();
};

téléchargeLesDonnéesBrutesSiiceaCron(dependencies);
