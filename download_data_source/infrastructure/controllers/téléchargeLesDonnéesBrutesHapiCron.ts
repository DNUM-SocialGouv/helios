import { TéléchargeLesDonnéesBrutesHapiUseCase } from "../../métier/use-cases/TéléchargeLesDonnéesBrutesHapiUseCase";
import { Dependencies, dependencies } from "../dependencies";

const téléchargeLesDonnéesBrutesHapiCron = (dependencies: Dependencies) => {
    const téléchargeLesDonnéesBrutesDeHapiUseCase = new TéléchargeLesDonnéesBrutesHapiUseCase(dependencies.hapiDownloadRawData);

    téléchargeLesDonnéesBrutesDeHapiUseCase.exécute();
};

téléchargeLesDonnéesBrutesHapiCron(dependencies);
