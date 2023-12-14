import { SaveSearchHistoryUseCase } from "../../métier/use-cases/SearchHistoryUseCase";
import { Dependencies } from "../dependencies";

export async function saveSearchHistoryEndpoint(dependencies: Dependencies, titre: string, idUser: string, finessNumber: string, type: string): Promise<void> {
    try {
        const saveSearchHistoryUseCase = new SaveSearchHistoryUseCase(dependencies.searchHistoryLoader);

        return await saveSearchHistoryUseCase.exécute(titre, idUser, finessNumber, type);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}