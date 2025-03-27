import { ParametreDeRechercheAvancee } from "../../métier/entities/ParametresDeRechercheAvancee";
import { RésultatDeRecherche } from "../../métier/entities/RésultatDeRecherche";
import {
  RechercheAvanceeParmiLesEntitesEtEtablissementsUseCase
} from "../../métier/use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(
  dependencies: Dependencies,
  params: ParametreDeRechercheAvancee): Promise<RésultatDeRecherche> {
  try {
    const rechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase = new RechercheAvanceeParmiLesEntitesEtEtablissementsUseCase(dependencies.rechercheLoader);
    return await rechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase.exécute(params);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
