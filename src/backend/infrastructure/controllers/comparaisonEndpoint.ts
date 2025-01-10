import { ProfilModel } from "../../../../database/models/ProfilModel";
import { ResultatDeComparaison } from "../../métier/entities/ResultatDeComparaison";
import { ComparaisonEtablissementsUseCase } from "../../métier/use-cases/ComparaisonEtablissementsUseCase";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function comparaisonEndpoint(
    dependencies: Dependencies,
    type: string,
    numerosFiness: string[],
    annee: string,
    page: number,
    order: string,
    orderBy: string,
    forExport: boolean,
    codeRegion: string,
    codeProfiles: string[]
): Promise<ResultatDeComparaison> {
    try {
        const comparaisonEtablissementsUseCase = new ComparaisonEtablissementsUseCase(dependencies.comparaisonLoader);
        const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
        const profiles = await loginUseCase.getUserProfiles(codeProfiles) as ProfilModel[];
        return await comparaisonEtablissementsUseCase.exécute(type, numerosFiness, annee, page, order, orderBy, forExport, codeRegion, profiles);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
