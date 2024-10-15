import { RésultatDeRecherche } from "../../métier/entities/RésultatDeRecherche";
import { CapaciteSMS, RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase } from "../../métier/use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(dependencies: Dependencies, terme: string, commune: string, page: number): Promise<RésultatDeRecherche> {
    try {
        const rechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase = new RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase(dependencies.rechercheLoader);

        const type: string = "";
        const statutJuridique: string[] = [];
        const capaciteSMS: CapaciteSMS[] = [
            { classification: 'publics_en_situation_de_handicap', ranges: [">30", "10,20", "20,30"] },
            { classification: 'personnes_agees', ranges: [">30", "10,20", "20,30"] }
        ];
        const order = "ASC";
        const orderBy = "";
        return await rechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase.exécute(terme, commune, type, statutJuridique, capaciteSMS, orderBy, order, page);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
