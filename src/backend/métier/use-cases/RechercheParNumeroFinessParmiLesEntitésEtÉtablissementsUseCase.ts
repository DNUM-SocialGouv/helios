import { Résultat } from "../entities/RésultatDeRecherche";
import { RechercheLoader } from "../gateways/RechercheLoader";

export class RechercheParNumeroFinessParmiLesEntitésEtÉtablissementsUseCase {
  constructor(private rechercheLoader: RechercheLoader) { }

  async exécute(
    finessNumber: string[],
  ): Promise<Résultat[]> {
    return await this.rechercheLoader.rechercheParNumeroFiness(finessNumber);
  }
}
