import { UtilisateursUseCase } from "../../métier/use-cases/UtilisateursUseCase";
import { Dependencies } from "../dependencies";

export async function deleteUserEndpoint(dependencies: Dependencies, userCode: string): Promise<string | void> {
  try {
    const UtilisateurUseCase = new UtilisateursUseCase(dependencies.utilisateurLoader);
    return await UtilisateurUseCase.deleteUser(userCode);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
