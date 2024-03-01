import { ReclamationUseCase } from "../../métier/use-cases/ReclamationUseCase";
import { Dependencies } from "../dependencies";

export async function createReclamationEndpoint(dependencies: Dependencies, row: any): Promise<void> {
  try {
    const reclamationUseCase = new ReclamationUseCase(dependencies.reclamationLoader);
    return await reclamationUseCase.createReclamation(row);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
