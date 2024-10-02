import { RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { RechercheLoader } from "../gateways/RechercheLoader";

export class RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase {
  constructor(private rechercheLoader: RechercheLoader) { }

  async exécute(terme: string, commune: string, page: number): Promise<RésultatDeRecherche> {
    return await this.rechercheLoader.rechercheAvancee(terme, commune, page);
  }
}
