import { RésultatDeRecherche } from '../entities/RésultatDeRecherche'
import { RechercheLoader } from '../gateways/RechercheLoader'

export class RechercheParmiLesEntitésEtÉtablissementsUseCase {
  constructor(private rechercheLoader: RechercheLoader) {}

  async exécute(terme: string): Promise<RésultatDeRecherche[]> {
    return await this.rechercheLoader.rechercheParTerme(terme)
  }
}
