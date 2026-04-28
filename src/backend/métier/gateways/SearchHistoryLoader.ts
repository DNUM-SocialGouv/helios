import { ResultatRechercheHistorique } from "../entities/ResultatHistorique";

export interface SearchHistoryLoader {
  saveSearchHistory(titre: string, idUser: string, finessNumber: string, type: string): Promise<void>;
  getAllUserSearchHistory(idUser: string): Promise<ResultatRechercheHistorique[]>
}
