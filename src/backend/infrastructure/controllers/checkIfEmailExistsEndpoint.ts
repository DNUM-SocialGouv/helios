import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function checkIfEmailExistsEndpoint(dependencies: Dependencies, email: string): Promise<boolean> {
    try {
        const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);

        return await loginUseCase.checkIfEmailExists(email);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
