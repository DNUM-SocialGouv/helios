import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function checkIfAdminEndpoint(dependencies: Dependencies, userId: string): Promise<boolean> {
    try {
        const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);

        return await loginUseCase.checkIfAdmin(userId);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
