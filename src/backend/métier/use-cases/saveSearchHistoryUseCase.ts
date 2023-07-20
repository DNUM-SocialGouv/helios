import { SearchHistoryLoader } from "../gateways/SearchHistoryLoader";

export class SaveSearchHistoryUseCase {
    constructor(private searchHistoryLoader: SearchHistoryLoader) { }

    async exécute(titre: string, idUser: string, finessNumber: string, type: string): Promise<void> {
        return await this.searchHistoryLoader.saveSearchHistory(titre, idUser, finessNumber, type);
    }
}
