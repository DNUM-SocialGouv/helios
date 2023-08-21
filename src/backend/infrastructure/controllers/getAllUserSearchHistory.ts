import { SearchHistoryModel } from "../../../../database/models/SearchHistoryModel";
import { GetAllUserSearchHistoryUseCase } from "../../métier/use-cases/SearchHistoryUseCase";
import { Dependencies } from "../dependencies";

export async function getAllUserSearchHistoryEndpoint(dependencies: Dependencies, idUser: string): Promise<SearchHistoryModel[]> {
    try {
        const getAllUserSearchHistoryUseCase = new GetAllUserSearchHistoryUseCase(dependencies.searchHistoryLoader);
        return await getAllUserSearchHistoryUseCase.exécute(idUser);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
