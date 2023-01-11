import { RésultatDeRecherche } from "../../métier/entities/RésultatDeRecherche";
import { RechercheParmiLesEntitésEtÉtablissementsUseCase } from "../../métier/use-cases/RechercheParmiLesEntitésEtÉtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies: Dependencies, terme: string, page: number): Promise<RésultatDeRecherche> {
  try {
    const rechercheParmiLesEntitésEtÉtablissementsUseCase = new RechercheParmiLesEntitésEtÉtablissementsUseCase(dependencies.rechercheLoader);

    return await rechercheParmiLesEntitésEtÉtablissementsUseCase.exécute(terme, page);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
