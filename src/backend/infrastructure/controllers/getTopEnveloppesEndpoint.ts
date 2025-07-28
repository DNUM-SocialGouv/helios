import { EnveloppesResult } from "../../métier/entities/ResultatDeComparaison";
import { ComparaisonEtablissementsUseCase } from "../../métier/use-cases/ComparaisonEtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function getTopEnveloppesEndpoint(dependencies: Dependencies): Promise<EnveloppesResult> {
    try {
        const comparaisonEtablissementsUseCase = new ComparaisonEtablissementsUseCase(dependencies.comparaisonLoader);
        return await comparaisonEtablissementsUseCase.getTopEnveloppes();
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}