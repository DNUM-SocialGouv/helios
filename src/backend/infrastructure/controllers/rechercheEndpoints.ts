import { RésultatDeRecherche } from "../../métier/entities/RésultatDeRecherche";
import { OrderDir } from "../../métier/use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";
import { RechercheParmiLesEntitésEtÉtablissementsUseCase } from "../../métier/use-cases/RechercheParmiLesEntitésEtÉtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies: Dependencies, terme: string, page: number, orderBy?: string, order?: OrderDir, displayTable?:boolean): Promise<RésultatDeRecherche> {
  try {
    const rechercheParmiLesEntitésEtÉtablissementsUseCase = new RechercheParmiLesEntitésEtÉtablissementsUseCase(dependencies.rechercheLoader);

    return await rechercheParmiLesEntitésEtÉtablissementsUseCase.exécute(terme, page, orderBy, order, displayTable);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
