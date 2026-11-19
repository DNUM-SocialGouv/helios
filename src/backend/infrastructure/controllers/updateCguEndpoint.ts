import { UtilisateursUseCase } from "../../métier/use-cases/UtilisateursUseCase";
import { Dependencies } from "../dependencies";

export async function updateCguEndpoint(dependencies: Dependencies, userCode: string, cguAccepted: boolean): Promise<void> {
  const utilisateurUseCase = new UtilisateursUseCase(dependencies.utilisateurLoader);
  return await utilisateurUseCase.updateCgu(userCode, cguAccepted);
}
