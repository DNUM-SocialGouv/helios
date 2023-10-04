import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function createAccountEndpoint(dependencies: Dependencies, firstName: string, lastName: string, email: string, institution: string): Promise<void> {
    try {
        const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
        // eslint-disable-next-line no-console
        console.log('make it to endpoint');
        return await loginUseCase.createAccount(firstName, lastName, email, institution);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
