import { Résultat } from "../../métier/entities/RésultatDeRecherche";
import { RechercheParNumeroFinessParmiLesEntitésEtÉtablissementsUseCase } from "../../métier/use-cases/RechercheParNumeroFinessParmiLesEntitésEtÉtablissementsUseCase";
import { dependencies } from "../dependencies";

export async function rechercheParNumeroFinessEndpoint(finessNumber: string[]): Promise<Résultat[]> {
  try {
    const rechercheParNumeroFinessParmiLesEntitésEtÉtablissementsUseCase = new RechercheParNumeroFinessParmiLesEntitésEtÉtablissementsUseCase(dependencies.rechercheLoader);

    return await rechercheParNumeroFinessParmiLesEntitésEtÉtablissementsUseCase.exécute(finessNumber);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
