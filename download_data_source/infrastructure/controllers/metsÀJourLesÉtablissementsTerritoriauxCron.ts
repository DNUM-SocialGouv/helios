import { MetsÀJourLesÉtablissementsTerritoriauxUseCase } from "../../métier/use-cases/MetsÀJourLesÉtablissementsTerritoriauxUseCase";
import { dependencies, Dependencies } from "../dependencies";

async function metsÀJourLesÉtablissementsTerritoriauxCron(dependencies: Dependencies) {
  const sauvegardeLesÉtablissementsTerritoriaux = new MetsÀJourLesÉtablissementsTerritoriauxUseCase(
    dependencies.établissementTerritorialSourceExterneLoader,
    dependencies.établissementTerritorialHeliosRepository,
    dependencies.entitéJuridiqueHeliosLoader,
    dependencies.établissementTerritorialHeliosLoader
  );

  await sauvegardeLesÉtablissementsTerritoriaux.exécute();
  setTimeout(() => process.exit(0), dependencies.DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS);
}

metsÀJourLesÉtablissementsTerritoriauxCron(dependencies);
