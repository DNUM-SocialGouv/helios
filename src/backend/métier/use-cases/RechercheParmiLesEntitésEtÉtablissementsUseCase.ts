import { RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { RechercheLoader } from "../gateways/RechercheLoader";

export class RechercheParmiLesEntitésEtÉtablissementsUseCase {
  constructor(private rechercheLoader: RechercheLoader) {}

  async exécute(terme: string, page: number): Promise<RésultatDeRecherche> {
    return await this.rechercheLoader.recherche(terme, page);
  }
}
