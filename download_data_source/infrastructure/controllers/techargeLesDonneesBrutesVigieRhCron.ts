import { TelechargeLesDonneesBrutesVigieRhUseCase } from "../../métier/use-cases/TelechargeLesDonneesBrutesVigieRhUseCase";
import { Dependencies, dependencies } from "../dependencies";

const téléchargeLesDonnéesBrutesVigieRhCron = (dependencies: Dependencies) => {
  const useCase = new TelechargeLesDonneesBrutesVigieRhUseCase(dependencies.vigieRhDownloadRawData);

  useCase.exécute();
};

téléchargeLesDonnéesBrutesVigieRhCron(dependencies);
