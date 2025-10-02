import { Dependencies } from "../dependencies";
import { AideUseCase } from "../../métier/use-cases/AideUseCase";

export async function getAideEndpoint(dependencies: Dependencies): Promise<Record<string, unknown>> {
  try {
    const useCase = new AideUseCase(dependencies.aideLoader);
    return await useCase.recupererContenu();
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
