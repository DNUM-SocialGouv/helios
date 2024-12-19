import { DatesMisAjourSources } from "../../métier/entities/ResultatDeComparaison";
import { ComparaisonEtablissementsUseCase } from "../../métier/use-cases/ComparaisonEtablissementsUseCase";
import { Dependencies } from "../dependencies";

export async function getDatesMiseAjourSourcesEndpoint(dependencies: Dependencies): Promise<DatesMisAjourSources> {
    try {
        const comparaisonEtablissementsUseCase = new ComparaisonEtablissementsUseCase(dependencies.comparaisonLoader);
        return await comparaisonEtablissementsUseCase.getDatesMisAJourSourcesComparaison();
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}