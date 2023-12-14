import { UpdatePasswordUseCase } from "../../métier/use-cases/updatePasswordUseCase";
import { Dependencies } from "../dependencies";

export async function updatePasswordEndpoint(dependencies: Dependencies, email: string, password: string, oldPassword: string): Promise<string> {
    try {
        const updatePasswordUseCase = new UpdatePasswordUseCase(dependencies.changePasswordLoader);

        return await updatePasswordUseCase.exécute(email, password, oldPassword);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
