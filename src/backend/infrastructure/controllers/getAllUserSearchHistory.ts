import { ResultatRechercheHistorique } from "../../métier/entities/ResultatHistorique";
import { GetAllUserSearchHistoryUseCase } from "../../métier/use-cases/SearchHistoryUseCase";
import { Dependencies } from "../dependencies";

export async function getAllUserSearchHistoryEndpoint(dependencies: Dependencies, idUser: string): Promise<ResultatRechercheHistorique[]> {
  try {
    const getAllUserSearchHistoryUseCase = new GetAllUserSearchHistoryUseCase(dependencies.searchHistoryLoader);
    return await getAllUserSearchHistoryUseCase.exécute(idUser);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
