import { ComparaisonEtablissementsUseCase } from "../../métier/use-cases/ComparaisonEtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function getAnneesComparaisonEndpoint(dependencies: Dependencies, type: string, numerosFiness: string[]): Promise<string[]> {
    try {
        const comparaisonEtablissementsUseCase = new ComparaisonEtablissementsUseCase(dependencies.comparaisonLoader);
        return await comparaisonEtablissementsUseCase.getAnneesComparaison(type, numerosFiness);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}