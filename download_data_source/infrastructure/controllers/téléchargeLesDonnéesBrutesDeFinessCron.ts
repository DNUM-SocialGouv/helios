import { TéléchargeLesDonnéesBrutesDeFinessUseCase } from "../../métier/use-cases/TéléchargeLesDonnéesBrutesDeFinessUseCase";
import { Dependencies, dependencies } from "../dependencies";

const téléchargeLesDonnéesBrutesDeFinessCron = (dependencies: Dependencies) => {
  const téléchargeLesDonnéesBrutesDeFinessUseCase = new TéléchargeLesDonnéesBrutesDeFinessUseCase(
    dependencies.finessDownloadRawData,
    dependencies.unzipRawData
  );

  téléchargeLesDonnéesBrutesDeFinessUseCase.exécute();
};

téléchargeLesDonnéesBrutesDeFinessCron(dependencies);
