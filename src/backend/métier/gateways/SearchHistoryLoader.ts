import { SearchHistoryModel } from "../../../../database/models/SearchHistoryModel";

export interface SearchHistoryLoader {
    saveSearchHistory(titre: string, idUser: string, finessNumber: string, type: string): Promise<void>;
    getAllUserSearchHistory(idUser: string): Promise<SearchHistoryModel[]>
}