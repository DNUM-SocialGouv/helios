import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { UtilisateursUseCase } from "../../métier/use-cases/UtilisateursUseCase";
import { Dependencies } from "../dependencies";

export async function updateUserEndpoint(
  dependencies: Dependencies,
  userCode: string,
  roleCode: string,
  institutionCode: string,
  profilsCode: string[]
): Promise<UtilisateurModel | null> {
  try {
    const UtilisateurUseCase = new UtilisateursUseCase(dependencies.utilisateurLoader);
    return await UtilisateurUseCase.updateUser(userCode, roleCode, institutionCode, profilsCode);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
