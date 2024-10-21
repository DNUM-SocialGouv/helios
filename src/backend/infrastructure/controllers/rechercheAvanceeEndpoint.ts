import { RésultatDeRecherche } from "../../métier/entities/RésultatDeRecherche";
import { RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase } from "../../métier/use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(
  dependencies: Dependencies,
  terme: string,
  commune: string,
  type: string,
  statutJuridique: string[],
  capaciter: any[],
  page: number
): Promise<RésultatDeRecherche> {
  try {
    const rechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase = new RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase(dependencies.rechercheLoader);
    const order = "ASC";
    const orderBy = "";
    return await rechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase.exécute(terme, commune, type, statutJuridique, capaciter, orderBy, order, page);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
