import { RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { RechercheLoader } from "../gateways/RechercheLoader";

export type OrderDir = "ASC" | "DESC" | undefined;
export type CapaciteSMS = {
  classification: string,
  ranges: string[]
};

export class RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase {
  constructor(private rechercheLoader: RechercheLoader) { }


  async exécute(terme: string, commune: string, type: string, statutJuridique: string[], capaciteSMS: CapaciteSMS[], orderBy: string, order: OrderDir, page: number): Promise<RésultatDeRecherche> {
    return await this.rechercheLoader.rechercheAvancee(terme, commune, type, statutJuridique, capaciteSMS, orderBy, order, page);
  }
}
