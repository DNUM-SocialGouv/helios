import { PasswordStatus } from "../../métier/entities/Utilisateur/RésultatLogin";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function checkPasswordStatusEndpoint(dependencies: Dependencies, email: string): Promise<PasswordStatus> {
  try {
    const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);

    return await loginUseCase.checkPasswordStatus(email);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
