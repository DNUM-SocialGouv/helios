import { UtilisateursUseCase } from "../../métier/use-cases/UtilisateursUseCase";
import { Dependencies } from "../dependencies";

export async function updateUserEndpoint(
  dependencies: Dependencies,
  userCode: string,
  roleCode: string,
  institutionCode: string,
  profilsCode: string[],
  firstname: string,
  lastname: string
): Promise<void> {
  try {
    const UtilisateurUseCase = new UtilisateursUseCase(dependencies.utilisateurLoader);
    return await UtilisateurUseCase.updateUser(userCode, roleCode, institutionCode, profilsCode, firstname, lastname);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
