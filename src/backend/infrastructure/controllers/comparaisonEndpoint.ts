import { ResultatDeComparaison } from "../../métier/entities/ResultatDeComparaison";
import { ComparaisonEtablissementsUseCase } from "../../métier/use-cases/ComparaisonEtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function comparaisonEndpoint(
    dependencies: Dependencies,
    type: string,
    numerosFiness: string[]
): Promise<ResultatDeComparaison> {
    try {
        const comparaisonEtablissementsUseCase = new ComparaisonEtablissementsUseCase(dependencies.comparaisonLoader);
        return await comparaisonEtablissementsUseCase.exécute(type, numerosFiness);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
