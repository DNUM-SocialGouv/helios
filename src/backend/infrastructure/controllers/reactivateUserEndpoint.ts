import { UtilisateursUseCase } from "../../métier/use-cases/UtilisateursUseCase";
import { Dependencies } from "../dependencies";

export async function reactivateUserEndpoint(dependencies: Dependencies, userCode: string): Promise<string | null> {
  try {
    const UtilisateurUseCase = new UtilisateursUseCase(dependencies.utilisateurLoader);
    return await UtilisateurUseCase.reactivateUser(userCode);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
