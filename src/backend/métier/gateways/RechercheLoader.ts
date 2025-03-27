import { ParametreDeRechercheAvancee } from "../entities/ParametresDeRechercheAvancee";
import { Résultat, RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { OrderDir } from "../use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";

export interface RechercheLoader {
  recherche(terme: string, page: number, orderBy?: string, order?: OrderDir, displayTable?: boolean): Promise<RésultatDeRecherche>;
  rechercheAvancee(params: ParametreDeRechercheAvancee): Promise<RésultatDeRecherche>;
  rechercheParNumeroFiness(finessNumber: string[]): Promise<Résultat[]>;
}
