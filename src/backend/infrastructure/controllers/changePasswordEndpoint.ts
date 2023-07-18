import { ChangePasswordUseCase } from "../../métier/use-cases/changePasswordUseCase";
import { Dependencies } from "../dependencies";

export async function changePasswordEndpoint(dependencies: Dependencies, loginToken: string, password: string): Promise<boolean> {
  try {
    const changePasswordUseCase = new ChangePasswordUseCase(dependencies.changePasswordLoader);

    return await changePasswordUseCase.exécute(loginToken, password);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
