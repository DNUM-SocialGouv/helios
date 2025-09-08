import { ParametreDeRechercheAvancee } from "../entities/ParametresDeRechercheAvancee";
import { RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { RechercheLoader } from "../gateways/RechercheLoader";

export class RechercheAvanceeParmiLesEntitesEtEtablissementsUseCase {
  constructor(private readonly rechercheLoader: RechercheLoader) { }

  async exécute(params: ParametreDeRechercheAvancee): Promise<RésultatDeRecherche> {
    return await this.rechercheLoader.rechercheAvancee(params);
  }
}
