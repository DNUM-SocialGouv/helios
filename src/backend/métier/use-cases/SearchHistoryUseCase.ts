import { SearchHistoryModel } from "../../../../database/models/SearchHistoryModel";
import { SearchHistoryLoader } from "../gateways/SearchHistoryLoader";

export class SaveSearchHistoryUseCase {
    constructor(private readonly searchHistoryLoader: SearchHistoryLoader) { }

    async exécute(titre: string, idUser: string, finessNumber: string, type: string): Promise<void> {
        return await this.searchHistoryLoader.saveSearchHistory(titre, idUser, finessNumber, type);
    }
}

export class GetAllUserSearchHistoryUseCase {
    constructor(private readonly searchHistoryLoader: SearchHistoryLoader) { }

    async exécute(idUser: string): Promise<SearchHistoryModel[]> {
        return await this.searchHistoryLoader.getAllUserSearchHistory(idUser);
    }
}