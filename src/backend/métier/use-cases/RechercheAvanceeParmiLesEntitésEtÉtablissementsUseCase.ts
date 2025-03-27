import { RésultatDeRecherche } from "../entities/RésultatDeRecherche";
import { RechercheLoader } from "../gateways/RechercheLoader";

export type OrderDir = "ASC" | "DESC" | undefined;
export type CapaciteSMS = {
  classification: string;
  ranges: string[];
};

export class RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase {
  constructor(private rechercheLoader: RechercheLoader) { }

  async exécute(
    terme: string,
    zone: string,
    zoneD: string,
    typeZone: string,
    type: string,
    statutJuridique: string[],
    capaciteSMS: CapaciteSMS[],
    orderBy: string,
    order: OrderDir,
    page: number,
    forExport: boolean
  ): Promise<RésultatDeRecherche> {
    return await this.rechercheLoader.rechercheAvancee(terme, zone, zoneD, typeZone, type, statutJuridique, capaciteSMS, orderBy, order, page, forExport);
  }
}
