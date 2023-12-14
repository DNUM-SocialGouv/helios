import { Institution } from "../../métier/entities/Utilisateur/Institution";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function getInstitutionsEndpoint(dependencies: Dependencies): Promise<Institution[]> {
    try {
        const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
        return await loginUseCase.getInstitutions();
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
