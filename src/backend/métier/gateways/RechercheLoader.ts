import { RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { OrderDir } from "../use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";

export interface RechercheLoader {
  recherche(terme: string, page: number): Promise<RésultatDeRecherche>;
  rechercheAvancee(terme: string, commune: string, type: string[], statutJuridique: string[], orderBy: string, order: OrderDir, page: number): Promise<RésultatDeRecherche>;
}
