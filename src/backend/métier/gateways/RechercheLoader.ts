import { RésultatDeRecherche } from '../entities/RésultatDeRecherche'

export interface RechercheLoader {
  rechercheParTerme(terme: string): Promise<RésultatDeRecherche[]>
}
