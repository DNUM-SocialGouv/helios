import { AideUseCase } from "../../métier/use-cases/AideUseCase";
import { Dependencies } from "../dependencies";

export async function getAideEndpoint(dependencies: Dependencies): Promise<Record<string, unknown>> {
  try {
    const useCase = new AideUseCase(dependencies.aideLoader);
    return await useCase.recupererContenu();
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
