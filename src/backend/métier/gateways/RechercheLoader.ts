import { RésultatDeRecherche } from "../entities/RésultatDeRecherche";

export interface RechercheLoader {
  recherche(terme: string, page: number): Promise<RésultatDeRecherche>;
}
