import { RésultatLogin } from "../../métier/entities/Utilisateur/RésultatLogin";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function loginEndpoint(dependencies: Dependencies, email: string, password: string): Promise<RésultatLogin> {
  try {
    const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);

    return await loginUseCase.exécute(email, password);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
