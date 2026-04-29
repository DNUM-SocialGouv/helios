import { RechercheUtilisateur } from "../../métier/entities/ResultatRechercheUtilisateur";
import { UtilisateursUseCase } from "../../métier/use-cases/UtilisateursUseCase";
import { Dependencies } from "../dependencies";

export async function getUserByCodeEndpoint(dependencies: Dependencies, code: string): Promise<RechercheUtilisateur | null> {
  try {
    const UtilisateurUseCase = new UtilisateursUseCase(dependencies.utilisateurLoader);
    return await UtilisateurUseCase.getUserByCode(code);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
