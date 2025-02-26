import { RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { RechercheLoader } from "../gateways/RechercheLoader";
import { OrderDir } from "./RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";

export class RechercheParmiLesEntitésEtÉtablissementsUseCase {
  constructor(private rechercheLoader: RechercheLoader) {}

  async exécute(terme: string, page: number, orderBy?: string, order?: OrderDir, displayTable?: boolean): Promise<RésultatDeRecherche> {
    return await this.rechercheLoader.recherche(terme, page, orderBy, order, displayTable);
  }
}
