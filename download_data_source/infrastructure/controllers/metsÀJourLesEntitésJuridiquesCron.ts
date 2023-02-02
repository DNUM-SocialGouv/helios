import { MetsÀJourLesEntitésJuridiquesUseCase } from "../../métier/use-cases/MetsÀJourLesEntitésJuridiquesUseCase";
import { dependencies, Dependencies } from "../dependencies";

async function metsÀJourLesEntitésJuridiquesCron(dependencies: Dependencies) {
  const metsÀJourLesEntitésJuridiquesUseCase = new MetsÀJourLesEntitésJuridiquesUseCase(
    dependencies.entitéJuridiqueSourceExterneLoader,
    dependencies.entitéJuridiqueHeliosRepository,
    dependencies.entitéJuridiqueHeliosLoader,
    dependencies.catégorisationSourceExterneLoader,
    dependencies.logger
  );

  await metsÀJourLesEntitésJuridiquesUseCase.exécute();
  setTimeout(() => process.exit(0), dependencies.DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS);
}

metsÀJourLesEntitésJuridiquesCron(dependencies);
