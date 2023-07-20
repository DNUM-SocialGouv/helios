import { SaveSearchHistoryUseCase } from "../../métier/use-cases/saveSearchHistoryUseCase";
import { Dependencies } from "../dependencies";

export async function saveSearchHistoryEndpoint(dependencies: Dependencies, titre: string, idUser: string, finessNumber: string): Promise<void> {
    try {
        // eslint-disable-next-line no-console
        console.log('from endpoint', idUser);
        const saveSearchHistoryUseCase = new SaveSearchHistoryUseCase(dependencies.searchHistoryLoader);

        return await saveSearchHistoryUseCase.exécute(titre, idUser, finessNumber);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}