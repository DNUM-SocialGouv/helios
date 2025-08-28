import { ComparaisonEtablissementsUseCase } from "../../métier/use-cases/ComparaisonEtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function getTypesFromFinessEndpoint(dependencies: Dependencies, finessNumber: string[]): Promise<string[]> {
    try {
        const comparaisonEtablissementsUseCase = new ComparaisonEtablissementsUseCase(dependencies.comparaisonLoader);
        return await comparaisonEtablissementsUseCase.getTypesFromFiness(finessNumber)
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}