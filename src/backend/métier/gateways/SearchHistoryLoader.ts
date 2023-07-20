export interface SearchHistoryLoader {
    saveSearchHistory(titre: string, idUser: string, finessNumber: string): Promise<void>;
}