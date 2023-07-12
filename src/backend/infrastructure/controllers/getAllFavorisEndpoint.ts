import { FavorisModel } from "../../../../database/models/FavorisModel";
import { GetAllFavorisUseCase } from "../../métier/use-cases/FavorisUseCase";
import { Dependencies } from "../dependencies";

export async function getAllFavorisEndpoint(dependencies: Dependencies, idUser: number): Promise<FavorisModel[]> {
    try {
        const getAllFavorisUseCase = new GetAllFavorisUseCase(dependencies.favorisLoader);

        return await getAllFavorisUseCase.exécute(idUser);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
