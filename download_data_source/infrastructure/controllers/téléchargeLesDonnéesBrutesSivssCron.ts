import { TéléchargeLesDonnéesBrutesSivssUseCase } from "../../métier/use-cases/TéléchargeLesDonnéesBrutesSivssUseCase";
import { Dependencies, dependencies } from "../dependencies";

const téléchargeLesDonnéesBrutesSivssCron = (dependencies: Dependencies) => {
  const téléchargeLesDonnéesBrutesSivssUseCase = new TéléchargeLesDonnéesBrutesSivssUseCase(dependencies.sivssDownloadRawData);

  téléchargeLesDonnéesBrutesSivssUseCase.exécute();
};

téléchargeLesDonnéesBrutesSivssCron(dependencies);
