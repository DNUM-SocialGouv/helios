export interface SearchHistoryLoader {
    saveSearchHistory(titre: string, idUser: string, finessNumber: string, type: string): Promise<void>;
}