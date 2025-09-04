import { CheckFinessInDatabaseUseCase } from "../../métier/use-cases/FavorisUseCase";
import { Dependencies } from "../dependencies";

export async function checkFinessInDatabaseEndpoint(dependencies: Dependencies, finessList: string[]): Promise<string[]> {
    try {
        const FavorisUseCase = new CheckFinessInDatabaseUseCase(dependencies.favorisLoader);
        return await FavorisUseCase.exécute(finessList)
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
