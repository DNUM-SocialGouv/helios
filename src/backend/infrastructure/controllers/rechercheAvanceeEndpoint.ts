import { RésultatDeRecherche } from "../../métier/entities/RésultatDeRecherche";
import {
  CapaciteSMS,
  OrderDir,
  RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase,
} from "../../métier/use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(
  dependencies: Dependencies,
  terme: string,
  zone: string,
  zoneD: string,
  typeZone: string,
  type: string,
  statutJuridique: string[],
  capaciteSMS: CapaciteSMS[],
  order: OrderDir,
  orderBy: string,
  page: number
): Promise<RésultatDeRecherche> {
  try {
    const rechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase = new RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase(dependencies.rechercheLoader);

    return await rechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase.exécute(terme, zone, zoneD, typeZone, type, statutJuridique, capaciteSMS, orderBy, order, page);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
