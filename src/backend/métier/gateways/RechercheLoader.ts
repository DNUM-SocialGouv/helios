import { ParametreDeRechercheAvancee, OrderDir } from "../entities/ParametresDeRechercheAvancee";
import { Résultat, RésultatDeRecherche } from "../entities/RésultatDeRecherche";

export interface RechercheLoader {
  recherche(terme: string, page: number, orderBy?: string, order?: OrderDir, displayTable?: boolean): Promise<RésultatDeRecherche>;
  rechercheAvancee(params: ParametreDeRechercheAvancee): Promise<RésultatDeRecherche>;
  rechercheParNumeroFiness(finessNumber: string[]): Promise<Résultat[]>;
}
