import { Résultat, RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { CapaciteSMS, OrderDir } from "../use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";

export interface RechercheLoader {
  recherche(terme: string, page: number, orderBy: string, order: OrderDir, displayTable: boolean): Promise<RésultatDeRecherche>;
  rechercheAvancee(
    terme: string,
    zone: string,
    zoneD: string,
    typeZone: string,
    type: string,
    statutJuridique: string[],
    capaciteSMS: CapaciteSMS[],
    orderBy: string,
    order: OrderDir,
    page: number
  ): Promise<RésultatDeRecherche>;
  rechercheParNumeroFiness(finessNumber: string[]): Promise<Résultat[]>;
}
