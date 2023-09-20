import { ProfilModel } from "../../../../database/models/ProfilModel";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function getUserProfileEndpoint(dependencies: Dependencies): Promise<ProfilModel | null> {
    try {
        const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);

        return await loginUseCase.getProfile()
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
