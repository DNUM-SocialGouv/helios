import { ComparaisonEtablissementsUseCase } from "../../métier/use-cases/ComparaisonEtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function getTopEnveloppesEndpoint(dependencies: Dependencies) {
    try {
        const comparaisonEtablissementsUseCase = new ComparaisonEtablissementsUseCase(dependencies.comparaisonLoader);
        return await comparaisonEtablissementsUseCase.getTopEnveloppes();
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}