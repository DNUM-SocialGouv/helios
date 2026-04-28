import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function loginErrorEndpoint(dependencies: Dependencies, email: string): Promise<string> {
  try {
    const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);

    return await loginUseCase.getLoginError(email);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
